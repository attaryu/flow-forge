# FlowForge Architecture


## Overview

The system consists of:

1. **Frontend** (React + React Flow) — Visual workflow editor and execution dashboard
2. **API Server** (NestJS) — REST API, authentication, workflow management
3. **Worker Service** (NestJS) — DAG executor, step-by-step orchestration
4. **Data Layer** (PostgreSQL + Redis) — Persistent state + job queues

## Core Decisions

### 1. Multi-Tenancy — Database Level Isolation

**Decision:** Every table has `tenant_id` (organization_id) foreign key. All queries filter by tenant automatically.

**Why:**
- Multiple organizations share one FlowForge instance
- Data isolation enforced at SQL, not just application logic
- JWT payload contains `organizationId` → auth middleware attaches to every request

**Example:**

```sql
SELECT * FROM workflows WHERE tenant_id = $1 AND id = $2;
-- If workflow belongs to different org, returns empty (401 Forbidden)
```

---

### 2. Execution Model — 1 Job Per Node (Not Entire Workflow)

**Decision:** Each workflow step = separate BullMQ job. API enqueues node-1 only. Worker orchestrates node transitions.

**Flow:**

```
User: POST /workflows/123/run
  ↓
API: Create workflow_run (pending)
  ↓
API: Enqueue ONE job → {nodeId: 'http-1', runId: 'run-456'}
  ↓
API: Return {runId, status: 'queued'} immediately

Worker: Pick job from queue
  ↓
Execute node (HTTP_CALL, DELAY, SCRIPT, etc.)
  ↓
Save result to step_logs table
  ↓
Load workflow graph from DB
  ↓
Determine next node (evaluate conditional if needed)
  ↓
Enqueue NEXT job → {nodeId: 'delay-1', runId: 'run-456'} with delay option
  ↓
Repeat until end of workflow
```

**Why per-node instead of entire workflow as 1 job:**

| Aspect | Per-Node (Chosen) | Entire Workflow |
| --- | --- | --- |
| DELAY node | Non-blocking (use job `delay` option) | Blocks worker with `sleep()` — wasteful |
| Crash resilience | Only current node lost; steps 1-2 saved | Likely retry from start, risk duplicate side-effects |
| Observability | Each node = 1 job entry in BullMQ | Need manual `updateProgress()` |
| Retry granularity | Retry only failed node | Retry entire workflow |
| Conditional branches | Branches determined at runtime | Must pre-build job tree (FlowProducer not suitable) |

**Job ID format:** `${runId}:${nodeId}` → prevents duplicate enqueuing

---

### 3. Separate Job Queues — Trigger vs Execution

**Decision:** Two BullMQ queues:
- **`triggerQueue`** — scheduled cron triggers (fire at exact time)
- **`executionQueue`** — step-by-step node execution

**Why:**
- Scheduled triggers need reliable timing (don’t get stuck behind slow jobs)
- Execution jobs can be slow, but trigger scheduler stays responsive
- Isolation prevents backlog from delaying next scheduled run

**Flow:**

```
Scheduler fires cron trigger
  ↓
Enqueue to triggerQueue: {workflowId, runId}
  ↓
triggerQueue worker picks it
  ↓
Create workflow_run record
  ↓
Enqueue node-1 to executionQueue
  ↓
executionQueue worker takes over, executes workflow step-by-step
```

---

### 4. Frontend Editor — React Flow (xyflow)

**Decision:** Use React Flow for visual workflow builder.

**Why (vs alternatives):**
- **AntV X6:** Imperative/vanilla JS core, not React-first. Overkill for simple node set. Longer setup.
- **Reaflow:** Small community, infrequent updates, auto-layout complexity. Risk for 4-day timeline.
- **React Flow:** Native React, built for node-based editors (Zapier, n8n clones all use it). Extensive docs. Conditional branching native (true/false handles). Fastest to implement.

**Usage:**

```tsx
// Custom nodes for each step type
<HttpCallNode />      // configured with URL, method, headers
<DelayNode />         // seconds input
<ScriptNode />        // concat/math operation select
<ConditionNode />     // operator + value inputs, 2 outputs (true/false)

// Edges connect nodes
// Conditional node has 2 sourceHandles (true, false)
```

---

### 5. DAG Validation — graphology-dag

**Decision:** Use `graphology` + `graphology-dag` for cycle detection and topological analysis.

**Why:**
- `hasCycle()` — real-time validation (prevent user from creating cycles)
- `topologicalSort()` — understand execution order
- `forEachNodeInTopologicalOrder()` — useful for future parallel execution feature
- Well-maintained, modular, used in production (sigma.js)
- Minimal dependency footprint

**Usage:**

```tsx
// At save time (design-time, not runtime)
const graph = parseWorkflowToGraph(workflowDefinition);

if (hasCycle(graph)) {
  throw new Error('Workflow contains a cycle');
}

// At execution, use graph for lookup, not topological sort
const nextNode = graph.outbound(currentNodeId); // runtime lookup
```

**Note:** graphology used for **design-time validation** only. At **runtime**, worker uses direct edge lookup from workflow definition (not topological sort).

---

### 6. Job Queue Library — BullMQ Queue (NOT FlowProducer)

**Decision:** Use BullMQ `Queue` + `Worker` directly. Do NOT use `FlowProducer`.

**Why FlowProducer doesn’t fit:**
- FlowProducer is for *fan-in / wait-for-all-children* patterns (parent waits for all children)
- Requires entire job tree defined atomically at enqueue time
- Conditional branches are runtime-determined (we don’t know which branch until node executes)
- Workaround (`moveToWaitingChildren()`) is essentially reimplementing state machine manually — defeats the purpose

**When FlowProducer would be relevant:** If future feature needs “run 3 actions parallel, wait for all, then continue” (fan-out + join). Not for conditional if/else.

**BullMQ Features Used:**
- ✅ Retry with exponential backoff (built-in)
- ✅ Job delay option (for DELAY nodes)
- ✅ Job state persistence (crash-safe)
- ✅ Event emitters (job:completed, job:failed)

---

### 7. Delay Node — Non-Blocking via Job Delay

**Decision:** DELAY node uses BullMQ’s `delay` option, not `sleep()`.

**Example:**

```tsx
// Instead of sleep (blocks worker)
await sleep(5000); // ❌ Blocks worker, wasteful

// Use job delay (non-blocking)
await executionQueue.add(
  'execute-step',
  { nodeId: 'next-node', runId },
  { delay: 5000 } // ✅ Scheduled in queue, worker free to grab next job
);
```

**Benefits:**
- Worker not blocked (can process other jobs)
- Scales to thousands of delayed jobs per worker
- BullMQ persists to Redis, survives crashes

---

### 8. Retry Logic — Per-Node Granular Retries

**Decision:** BullMQ retry at job level. Only retry failed node, not entire workflow.

**Configuration:**

```tsx
queue.process(async (job) => {
  try {
    await executeStep(job.data);
  } catch (error) {
    // BullMQ automatically retries based on job config
    throw error; // triggers retry
  }
});

// Job enqueue options
executionQueue.add(
  'execute-step',
  { ... },
  {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000 // 2s, 4s, 8s delays
    }
  }
);
```

**Applies to:** HTTP_CALL, SCRIPT_EXECUTION

**Not applied to:** DELAY, CONDITIONAL_BRANCH

---

### 9. Conditional Branching — Runtime Edge Lookup

**Decision:** Evaluate condition at runtime, then look up next node from graph edges.

**Flow:**

```
ConditionNode executes:
  ↓
Evaluate condition (e.g., "status == 200")
  ↓
Result: true or false
  ↓
Find edge with sourceHandle matching result
  graph.outbound(nodeId).filter(edge => edge.sourceHandle === result)
  ↓
Enqueue job for matched target node
```

**In workflow definition:**

```json
{
  "nodes": [
    {"id": "http-1", "type": "HTTP_CALL", ...},
    {"id": "cond-1", "type": "CONDITIONAL_BRANCH", ...}
  ],
  "edges": [
    {"from": "http-1", "to": "cond-1"},
    {"from": "cond-1", "to": "success-node", "sourceHandle": "true"},
    {"from": "cond-1", "to": "error-node", "sourceHandle": "false"}
  ]
}
```

---

### 10. State Persistence — Database (Not Job Tree)

**Decision:** Workflow execution state stored in `workflow_runs` and `step_logs` tables, not in BullMQ job structure.

**Why:**
- Database is source of truth for historical runs
- Job state only tracks “is this job pending/active/done”
- Decouples job queue from execution history
- UI queries DB directly, doesn’t depend on queue state

**Data:**

```sql
workflow_runs: {runId, workflowId, status, startedAt, endedAt, ...}
step_logs: {runId, nodeId, status, input, output, executedAt, ...}
```

---

### 11. Real-Time Updates — SSE with Redis Pub/Sub

**Decision:** Worker publishes step updates to Redis, API subscribes and streams to frontend via SSE.

**Flow:**

```
Worker finishes step 1:
  ↓
Publish to Redis: channel = `workflow-run:${runId}`
  payload = {nodeId, status, output, timestamp}
  ↓
API SSE subscriber listening on `/workflows/:runId/events`
  ↓
SSE sends to browser
  ↓
Frontend updates UI in real-time
```

**Fallback:** If SSE disconnects, frontend polls workflow_run status (every 5s).

---

### 12. Multi-Tenancy in Execution

**Decision:** Worker respects tenant_id when reading workflows and writing logs.

**Implementation:**

```tsx
// Worker receives: { runId, nodeId }
// Looks up run to get tenant_id
const run = await db.query(
  'SELECT * FROM workflow_runs WHERE id = $1',
  [runId]
);
const tenantId = run.tenant_id;

// Load workflow with tenant check
const workflow = await db.query(
  'SELECT * FROM workflows WHERE id = $1 AND tenant_id = $2',
  [run.workflowId, tenantId]
);
// If different tenant tries to access this run, returns empty (security)
```

---

## Data Flow — Complete Example

**Scenario:** Run workflow with HTTP call → delay → conditional → two branches

```
1. User clicks "Run Now" on workflow

2. API Handler:
   - Creates workflow_run record (pending)
   - Enqueues job: {workflowId, runId, nodeId: 'http-1'}
   - Returns {runId, status: 'queued'}

3. Frontend subscribes to SSE: /workflows/:runId/events

4. ExecutionQueue Worker (Job 1):
   - Picks job (nodeId: 'http-1')
   - Executes HTTP call → GET https://api.example.com/status
   - Saves step_log: {status: 'success', output: '200 OK'}
   - Publishes SSE: {nodeId: 'http-1', status: 'success', output: '200 OK'}
   - Looks up edges from 'http-1' → finds 'delay-1'
   - Enqueues job: {nodeId: 'delay-1', runId}

5. Frontend receives SSE → updates node 'http-1' to green

6. ExecutionQueue Worker (Job 2):
   - Picks job (nodeId: 'delay-1')
   - Job has delay: 5000 ms (scheduled, not blocking)
   - Enqueues job: {nodeId: 'cond-1', runId} with delay 5000

7. After 5 seconds, ExecutionQueue Worker (Job 3):
   - Picks job (nodeId: 'cond-1')
   - Evaluates condition: "status from http-1 == 200?"
   - Result: true
   - Finds edge with sourceHandle: 'true'
   - Enqueues job: {nodeId: 'success-node', runId}

8. ExecutionQueue Worker (Job 4):
   - Executes 'success-node' (e.g., send Slack message)
   - Last node → marks workflow_run as 'success'
   - Publishes SSE: {runId, status: 'success'}

9. Frontend receives SSE → workflow complete
```

---

## Trade-Offs

**Per-Node Jobs vs Entire-Workflow Job:**
- ✅ Per-node: Better for delays, granular retry, crash resilience
- ❌ Entire-workflow: Simpler, but blocks on delays, harder to recover

**React Flow vs Custom React:**
- ✅ React Flow: Pre-built, documented, battle-tested
- ❌ Custom: More control, but slow to implement

**Sequential Steps vs Parallel:**
- ✅ Sequential: Simple logic, sufficient for MVP
- ❌ Parallel: Complex, not needed yet

**Separate Queues vs Single Queue:**
- ✅ Separate: Trigger reliability, isolation
- ❌ Single: Simpler, but triggers can get stuck

---

## Future Enhancements

1. **Parallel Steps:** Detect independent branches, execute with `Promise.all()`
2. **Fan-Out/Join:** Run multiple actions parallel, wait for all (use FlowProducer then)
3. **Custom Nodes:** Allow users to define custom step types
4. **Webhooks:** Support incoming webhooks as workflow trigger
5. **Scheduled Retries:** Retry failed workflows at specific times
6. **Step Dependencies:** Explicit data passing between steps (currently implicit)

---

## Key Principles

1. ✅ **Per-Node Execution:** Sequential, reliable, observable
2. ✅ **Non-Blocking Delays:** Use job delay, not sleep
3. ✅ **Separate Queues:** Trigger reliability, execution scalability
4. ✅ **Multi-Tenant First:** Every query filters by org_id
5. ✅ **State in Database:** DB is source of truth, not job tree
6. ✅ **Real-Time Feedback:** SSE + Redis Pub/Sub for live updates
7. ✅ **Fail-Safe:** Retry logic, crash resilience, idempotency