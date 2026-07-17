import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RunsRepository } from '../repositories/runs.repository';
import { WorkflowsService } from '../../workflows/services/workflows.service';

@Injectable()
export class RunsService {
  constructor(
    @InjectQueue('executionQueue') private readonly executionQueue: Queue,
    private readonly runsRepository: RunsRepository,
    private readonly workflowsService: WorkflowsService,
  ) {}

  async triggerRun(workflowId: string, tenantId: string, userId: string) {
    // 1. Verifikasi workflow exists dan miliki tenant yang cocok
    const workflow = await this.workflowsService.findOne(workflowId, tenantId);
    
    const definition = workflow.definition as any;
    const nodes = definition?.nodes || [];
    
    if (nodes.length === 0) {
      throw new Error('Cannot run a workflow without nodes');
    }

    const firstNodeId = nodes[0].id;

    // 2. Buat record workflow_run
    const run = await this.runsRepository.createRun(
      workflowId,
      tenantId,
      userId,
      'manual',
    );

    // 3. Enqueue job ke BullMQ executionQueue
    await this.executionQueue.add(
      'execute-step',
      {
        runId: run.id,
        nodeId: firstNodeId,
        tenantId,
      },
      {
        jobId: `${run.id}-${firstNodeId}`, // Idempotency
        attempts: nodes[0].type === 'HTTP_CALL' ? 3 : 1,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    return {
      runId: run.id,
      status: 'queued',
      createdAt: run.createdAt,
    };
  }

  async getWorkflowRuns(workflowId: string, tenantId: string) {
    return this.runsRepository.findManyByWorkflow(workflowId, tenantId);
  }

  async getRunDetail(runId: string, tenantId: string) {
    const run = await this.runsRepository.findOneWithSteps(runId, tenantId);
    if (!run) {
      throw new NotFoundException(`Workflow run with ID ${runId} not found`);
    }
    return run;
  }
}
