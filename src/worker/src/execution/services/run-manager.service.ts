import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../shared/providers/database.provider';

@Injectable()
export class RunManagerService {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  async getRunWithWorkflow(runId: string, tenantId: string): Promise<any> {
    const runQuery = `
      SELECT 
        r.id as run_id, 
        r.workflow_runs__status as status,
        w.id as workflow_id,
        w.workflows__definition as definition
      FROM workflow_runs r
      JOIN workflows w ON r.workflow_runs__workflow_id = w.id
      WHERE r.id = $1 AND r.workflow_runs__tenant_id = $2
    `;
    const res = await this.dbProvider.pool.query(runQuery, [runId, tenantId]);
    if (res.rows.length === 0) return null;
    return res.rows[0];
  }

  async markRunning(runId: string): Promise<void> {
    const query = `
      UPDATE workflow_runs 
      SET 
        workflow_runs__status = 'running',
        workflow_runs__started_at = COALESCE(workflow_runs__started_at, NOW())
      WHERE id = $1 AND workflow_runs__status = 'pending'
    `;
    await this.dbProvider.pool.query(query, [runId]);
  }

  async markSuccess(runId: string): Promise<void> {
    const query = `
      UPDATE workflow_runs 
      SET 
        workflow_runs__status = 'success',
        workflow_runs__ended_at = NOW(),
        workflow_runs__total_duration_ms = EXTRACT(EPOCH FROM (NOW() - workflow_runs__started_at)) * 1000
      WHERE id = $1
    `;
    await this.dbProvider.pool.query(query, [runId]);
  }

  async markFailed(runId: string, errorMessage: string): Promise<void> {
    const query = `
      UPDATE workflow_runs 
      SET 
        workflow_runs__status = 'failed',
        workflow_runs__ended_at = NOW(),
        workflow_runs__error_message = $1,
        workflow_runs__total_duration_ms = CASE 
          WHEN workflow_runs__started_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (NOW() - workflow_runs__started_at)) * 1000 
          ELSE null 
        END
      WHERE id = $2
    `;
    await this.dbProvider.pool.query(query, [errorMessage, runId]);
  }
}
