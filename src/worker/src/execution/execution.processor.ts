import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { ExecutionJobPayload } from '../shared/types/job-payload.interface';
import { RunManagerService } from './services/run-manager.service';
import { StepLoggerService } from './services/step-logger.service';
import { ContextService } from './services/context.service';
import { NodeExecutorService } from './node-executor.service';
import { RedisProvider } from '../shared/providers/redis.provider';

@Processor('executionQueue')
@Injectable()
export class ExecutionProcessor extends WorkerHost {
  private readonly logger = new Logger(ExecutionProcessor.name);

  constructor(
    @InjectQueue('executionQueue') private readonly executionQueue: Queue,
    private readonly runManager: RunManagerService,
    private readonly stepLogger: StepLoggerService,
    private readonly contextService: ContextService,
    private readonly nodeExecutor: NodeExecutorService,
    private readonly redisProvider: RedisProvider,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { type, runId, nodeId, tenantId } = job.data;

    // Handle Timeout Watchdog Job
    if (job.name === 'timeout-watchdog' || type === 'timeout') {
      return this.handleTimeout(runId, tenantId);
    }

    this.logger.log(`Processing runId=${runId}, nodeId=${nodeId}`);

    // 1. Ambil run dan workflow definition
    const run = await this.runManager.getRunWithWorkflow(runId, tenantId);
    if (!run) {
      this.logger.error(`Workflow run not found or tenant mismatch: runId=${runId}, tenantId=${tenantId}`);
      return;
    }

    // Jika status sudah failed atau success (misal karena timeout duluan), jangan jalankan step berikutnya
    if (run.status === 'failed' || run.status === 'success') {
      this.logger.warn(`Run ${runId} is already in state: ${run.status}. Aborting execution step ${nodeId}.`);
      return;
    }

    const definition = run.definition;
    const nodes = definition.nodes || [];
    const edges = definition.edges || [];

    const node = nodes.find((n: any) => n.id === nodeId);
    if (!node) {
      const errorMsg = `Node ${nodeId} not found in workflow definition`;
      this.logger.error(errorMsg);
      await this.runManager.markFailed(runId, errorMsg);
      await this.publishEvent(runId, { type: 'workflow_done', runId, status: 'failed', error: errorMsg });
      return;
    }

    // 2. Mark running di database jika status masih pending
    if (run.status === 'pending') {
      await this.runManager.markRunning(runId);
      // Buat timeout watchdog job (10 menit)
      await this.createTimeoutWatchdog(runId, tenantId);
    }

    // 3. Log step START
    const startTime = Date.now();
    await this.stepLogger.logStart(runId, node);
    await this.publishEvent(runId, { type: 'step_started', nodeId, stepType: node.type, timestamp: new Date() });

    // 4. Kumpulkan context output dari step-step sebelumnya yang sukses
    const context = await this.contextService.buildContext(runId);

    // 5. Eksekusi Node
    try {
      const result = await this.nodeExecutor.execute(node, context);
      const durationMs = Date.now() - startTime;

      if (result.status === 'success') {
        // Tulis step log SUKSES
        await this.stepLogger.logResult(
          runId,
          nodeId,
          'success',
          result.output,
          null,
          durationMs,
          job.attemptsMade,
        );

        await this.publishEvent(runId, {
          type: 'step_completed',
          nodeId,
          status: 'success',
          output: result.output,
          durationMs,
        });

        // 6. Cari next node
        const nextNodeId = this.getNextNodeId(edges, nodeId, result.nextHandle);

        if (nextNodeId) {
          // Jadwalkan job untuk next step
          const delayMs = result.delayMs || 0;
          await this.executionQueue.add(
            'execute-step',
            { runId, nodeId: nextNodeId, tenantId },
            {
              jobId: `${runId}-${nextNodeId}`, // Idempotency
              delay: delayMs,
              attempts: node.type === 'HTTP_CALL' ? 3 : 1,
              backoff: {
                type: 'exponential',
                delay: 2000,
              },
            },
          );
        } else {
          // Akhir dari workflow
          await this.runManager.markSuccess(runId);
          await this.publishEvent(runId, { type: 'workflow_done', runId, status: 'success', totalDurationMs: Date.now() - startTime });
          // Hapus watchdog
          await this.executionQueue.remove(`timeout-${runId}`);
        }
      } else {
        // Node gagal dieksekusi secara logis
        const durationMs = Date.now() - startTime;
        await this.stepLogger.logResult(
          runId,
          nodeId,
          'failed',
          null,
          result.error,
          durationMs,
          job.attemptsMade,
        );

        await this.publishEvent(runId, {
          type: 'step_failed',
          nodeId,
          error: result.error,
          retryCount: job.attemptsMade,
        });

        await this.runManager.markFailed(runId, result.error || 'Execution failed');
        await this.publishEvent(runId, {
          type: 'workflow_done',
          runId,
          status: 'failed',
          error: result.error,
        });
      }
    } catch (error: any) {
      // Catch error di sini jika handler men-throw error (seperti HTTP_CALL untuk retry)
      const durationMs = Date.now() - startTime;
      
      const attempts = job.opts?.attempts ?? 1;
      const isLastAttempt = job.attemptsMade + 1 >= attempts;
      
      if (isLastAttempt) {
        // Log FAILED permanen karena sudah mencapai max attempt
        await this.stepLogger.logResult(
          runId,
          nodeId,
          'failed',
          null,
          error.message,
          durationMs,
          job.attemptsMade,
        );

        await this.publishEvent(runId, {
          type: 'step_failed',
          nodeId,
          error: error.message,
          retryCount: job.attemptsMade,
        });

        await this.runManager.markFailed(runId, error.message);
        await this.publishEvent(runId, {
          type: 'workflow_done',
          runId,
          status: 'failed',
          error: error.message,
        });
      } else {
        // Re-throw agar BullMQ melakukan retry otomatis
        throw error;
      }
    }
  }

  private getNextNodeId(edges: any[], currentNodeId: string, handle?: string): string | null {
    // Cari outbound edges dari currentNodeId
    const outbound = edges.filter((e: any) => e.from === currentNodeId);
    if (outbound.length === 0) return null;

    if (handle) {
      // Conditional branch: cari edge dengan sourceHandle yang cocok ('true' / 'false')
      const matched = outbound.find((e: any) => e.sourceHandle === handle);
      return matched ? matched.to : null;
    }

    // Default sequential edge
    return outbound[0].to;
  }

  private async createTimeoutWatchdog(runId: string, tenantId: string): Promise<void> {
    const timeoutMs = parseInt(process.env.WORKFLOW_TIMEOUT_MS || '600000', 10); // 10 menit
    await this.executionQueue.add(
      'timeout-watchdog',
      { type: 'timeout', runId, tenantId },
      {
        jobId: `timeout-${runId}`,
        delay: timeoutMs,
      },
    );
  }

  private async handleTimeout(runId: string, tenantId: string): Promise<void> {
    this.logger.warn(`Watchdog triggered. Checking timeout for runId=${runId}`);
    const run = await this.runManager.getRunWithWorkflow(runId, tenantId);
    
    if (run && (run.status === 'pending' || run.status === 'running')) {
      const errorMsg = 'Workflow execution exceeded 10-minute timeout';
      await this.runManager.markFailed(runId, errorMsg);
      await this.publishEvent(runId, {
        type: 'workflow_done',
        runId,
        status: 'failed',
        error: errorMsg,
      });
      this.logger.error(`RunId=${runId} has been terminated due to timeout.`);
    }
  }

  private async publishEvent(runId: string, event: any): Promise<void> {
    await this.redisProvider.client.publish(
      `workflow-run:${runId}`,
      JSON.stringify(event),
    );
  }
}
