import { Injectable } from '@nestjs/common';
import { PrismaProvider } from '../../../shared/providers/prisma/prisma.provider';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { UpdateWorkflowDto } from '../dto/update-workflow.dto';

@Injectable()
export class WorkflowsRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(tenantId: string, createdBy: string, data: CreateWorkflowDto) {
    return this.prisma.workflow.create({
      data: {
        tenantId,
        createdBy,
        name: data.name,
        description: data.description,
        definition: data.definition,
        status: 'active',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.workflow.findMany({
      where: {
        tenantId,
        status: 'active',
      },
      include: {
        creator: {
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

  async findOneByIdAndTenant(id: string, tenantId: string) {
    return this.prisma.workflow.findFirst({
      where: {
        id,
        tenantId,
        status: 'active',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, tenantId: string, data: UpdateWorkflowDto) {
    return this.prisma.workflow.update({
      where: {
        id,
        tenantId,
      },
      data: {
        name: data.name,
        description: data.description,
        definition: data.definition,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async softDelete(id: string, tenantId: string) {
    return this.prisma.workflow.update({
      where: {
        id,
        tenantId,
      },
      data: {
        status: 'archived',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
