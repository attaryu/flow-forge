import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../shared/providers/database.provider';

@Injectable()
export class StepLoggerService {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  async logStart(
    runId: string,
    node: { id: string; name?: string; type: string },
    input: any = null,
  ): Promise<string> {
    const logId = crypto.randomUUID();
    const query = `
      INSERT INTO step_logs (
        id, 
        step_logs__run_id, 
        step_logs__step_id, 
        step_logs__step_name, 
        step_logs__step_type, 
        status, 
        input, 
        step_logs__executed_at, 
        step_logs__created_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id
    `;
    await this.dbProvider.pool.query(query, [
      logId,
      runId,
      node.id,
      node.name || node.id,
      node.type,
      'running',
      input ? JSON.stringify(input) : null,
    ]);
    return logId;
  }

  async logResult(
    runId: string,
    nodeId: string,
    status: 'success' | 'failed',
    output: any = null,
    errorMessage: string | null = null,
    durationMs: number = 0,
    retryCount: number = 0,
  ): Promise<void> {
    const query = `
      UPDATE step_logs 
      SET 
        status = $1,
        output = $2,
        step_logs__error_message = $3,
        step_logs__duration_ms = $4,
        step_logs__retry_count = $5
      WHERE step_logs__run_id = $6 AND step_logs__step_id = $7 AND status = 'running'
    `;
    await this.dbProvider.pool.query(query, [
      status,
      output ? (typeof output === 'string' ? output : JSON.stringify(output)) : null,
      errorMessage,
      durationMs,
      retryCount,
      runId,
      nodeId,
    ]);
  }
}
