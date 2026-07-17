import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { DatabaseProvider } from '../shared/providers/database.provider';

@Processor('triggerQueue')
@Injectable()
export class TriggerProcessor extends WorkerHost {
  private readonly logger = new Logger(TriggerProcessor.name);

  constructor(
    @InjectQueue('executionQueue') private readonly executionQueue: Queue,
    private readonly dbProvider: DatabaseProvider,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { workflowId, tenantId, triggerType } = job.data;
    this.logger.log(`Triggering workflowId=${workflowId} for tenantId=${tenantId} via ${triggerType || 'scheduled'}`);

    // 1. Ambil workflow dan definition
    const wfQuery = `
      SELECT id, workflows__definition 
      FROM workflows 
      WHERE id = $1 AND workflows__tenant_id = $2 AND workflows__status = 'active'
    `;
    const wfRes = await this.dbProvider.pool.query(wfQuery, [workflowId, tenantId]);
    if (wfRes.rows.length === 0) {
      this.logger.error(`Workflow ${workflowId} not found or inactive for tenant ${tenantId}`);
      return;
    }

    const workflow = wfRes.rows[0];
    const definition = workflow.workflows__definition;
    const nodes = definition?.nodes || [];
    if (nodes.length === 0) {
      this.logger.error(`Workflow ${workflowId} has no nodes in definition`);
      return;
    }

    const firstNodeId = nodes[0].id;
    const runId = crypto.randomUUID();

    // 2. Create workflow run record (status: pending)
    const runQuery = `
      INSERT INTO workflow_runs (
        id, 
        workflow_runs__workflow_id, 
        workflow_runs__tenant_id, 
        workflow_runs__trigger_type, 
        workflow_runs__status, 
        workflow_runs__created_at
      ) 
      VALUES ($1, $2, $3, $4, 'pending', NOW())
    `;
    await this.dbProvider.pool.query(runQuery, [
      runId,
      workflowId,
      tenantId,
      triggerType || 'scheduled',
    ]);

    // 3. Enqueue first node execution
    await this.executionQueue.add(
      'execute-step',
      { runId, nodeId: firstNodeId, tenantId },
      {
        jobId: `${runId}-${firstNodeId}`, // Idempotency
        attempts: nodes[0].type === 'HTTP_CALL' ? 3 : 1,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    this.logger.log(`Enqueued first step of workflowId=${workflowId} for runId=${runId}`);
  }
}
