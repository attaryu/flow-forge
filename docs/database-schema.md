# Database Schema

This document describes the database tables and relationships for FlowForge.

---

## Tables

### 1. Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Store user accounts globally.

---

### 2. Organizations (Tenants)

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Represent customers/teams (tenants).

---

### 3. Roles

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL, -- 'owner', 'editor', 'viewer'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Define role types for access control.

---

### 4. Organization Members

```sql
CREATE TABLE organization_members (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);
```

**Purpose:** Link users to organizations with roles (one-to-many).

---

### 5. User Sessions

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_token ON user_sessions(token);
```

**Purpose:** Manage JWT tokens for authentication (supports multiple sessions per user).

---

### 6. Workflows

```sql
CREATE TABLE workflows (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  definition JSONB NOT NULL, -- DAG: {nodes: [...], edges: [...]}
  version INT NOT NULL DEFAULT 1,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived'
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflows_tenant_id ON workflows(tenant_id);
```

**Purpose:** Store workflow definitions (blueprints/templates).

**Definition Example:**

```json
{
  "nodes": [
    {"id": "http-1", "type": "HTTP_CALL", "config": {"url": "...", "method": "GET"}},
    {"id": "delay-1", "type": "DELAY", "config": {"seconds": 5}}
  ],
  "edges": [
    {"from": "http-1", "to": "delay-1"}
  ]
}
```

---

### 7. Workflow Versions

```sql
CREATE TABLE workflow_versions (
  id UUID PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  definition JSONB NOT NULL,
  version INT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflow_versions_workflow_id ON workflow_versions(workflow_id);
```

**Purpose:** Keep historical record of all workflow changes (audit trail, rollback).

---

### 8. Workflow Triggers

```sql
CREATE TABLE workflow_triggers (
  id UUID PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  trigger_type VARCHAR(50) NOT NULL, -- 'manual', 'scheduled', 'webhook'
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflow_triggers_workflow_id ON workflow_triggers(workflow_id);
CREATE INDEX idx_workflow_triggers_trigger_type ON workflow_triggers(trigger_type);
```

**Purpose:** Define how workflows are triggered (one workflow can have multiple triggers).

**Config Examples:**

```json
-- Scheduled (cron)
{"cron": "0 8 * * *", "timezone": "UTC"}

-- Webhook
{"path": "/workflows/workflow-001/webhook", "secret": "abc123"}

-- Manual
{}
```

---

### 9. Workflow Runs

```sql
CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  triggered_by UUID REFERENCES users(id), -- NULL if scheduled/webhook
  trigger_type VARCHAR(50), -- 'manual', 'scheduled', 'webhook'
  status VARCHAR(50) DEFAULT 'pending', -- 'running', 'success', 'failed'
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  total_duration_ms INT,
  error_message TEXT,
  ai_diagnosis TEXT, -- AI-generated failure explanation
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);
CREATE INDEX idx_workflow_runs_tenant_id ON workflow_runs(tenant_id);
CREATE INDEX idx_workflow_runs_created_at ON workflow_runs(created_at DESC);
```

**Purpose:** Record each execution of a workflow (one row per run).

---

### 10. Step Logs

```sql
CREATE TABLE step_logs (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  step_id VARCHAR(255), -- matches node.id in workflow definition
  step_name VARCHAR(255),
  step_type VARCHAR(50), -- 'HTTP_CALL', 'DELAY', 'CONDITIONAL_BRANCH'
  status VARCHAR(50), -- 'running', 'success', 'failed'
  input JSONB, -- input data to step
  output TEXT, -- output/result from step
  error_message TEXT,
  duration_ms INT,
  retry_count INT DEFAULT 0,
  executed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_step_logs_run_id ON step_logs(run_id);
CREATE INDEX idx_step_logs_executed_at ON step_logs(executed_at DESC);
```

**Purpose:** Detailed log of each step execution within a run (high-volume table).

---

## Relationships

```
organizations (1) ──→ (many) organization_members ──→ (1) roles
                          ↓
                        users

organizations (1) ──→ (many) workflows
                          ↓
                    workflow_versions
                    workflow_triggers (1 workflow can have multiple triggers)
                    workflow_runs
                          ↓
                    step_logs
```

---

## Multi-Tenancy

Every query must filter by `tenant_id`:

```sql
-- Get workflows for organization
SELECT * FROM workflows WHERE tenant_id = $1;

-- Get runs for organization
SELECT * FROM workflow_runs WHERE tenant_id = $1;

-- Get step logs for organization
SELECT sl.* FROM step_logs sl
JOIN workflow_runs wr ON sl.run_id = wr.id
WHERE wr.tenant_id = $1;
```

---

## Key Design Decisions

| Table | Decision | Reason |
| --- | --- | --- |
| **workflow_triggers** | Separate from workflows | One workflow can have multiple triggers (scheduled + webhook) |
| **workflow_versions** | Separate history table | Keeps audit trail, enables rollback |
| **step_logs** | Separate high-volume table | Optimized for time-range queries and retention policies |
| **user_sessions** | Token management | Supports multiple concurrent sessions per user |
| **organizations** | Instead of "tenants" | More semantic for multi-tenant SaaS |

---
