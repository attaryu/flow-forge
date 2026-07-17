import { Injectable } from '@nestjs/common';
import { PrismaProvider } from '../../../shared/providers/prisma/prisma.provider';

@Injectable()
export class RunsRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async createRun(
    workflowId: string,
    tenantId: string,
    triggeredBy: string | null,
    triggerType: string,
  ) {
    return this.prisma.workflowRun.create({
      data: {
        workflowId,
        tenantId,
        triggeredBy,
        triggerType,
        status: 'pending',
      },
    });
  }

  async findManyByWorkflow(workflowId: string, tenantId: string) {
    return this.prisma.workflowRun.findMany({
      where: {
        workflowId,
        tenantId,
      },
      include: {
        triggerer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneWithSteps(runId: string, tenantId: string) {
    return this.prisma.workflowRun.findFirst({
      where: {
        id: runId,
        tenantId,
      },
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
        triggerer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        stepLogs: {
          orderBy: {
            executedAt: 'asc',
          },
        },
      },
    });
  }
}
