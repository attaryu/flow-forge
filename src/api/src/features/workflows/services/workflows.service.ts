import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkflowsRepository } from '../repositories/workflows.repository';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { UpdateWorkflowDto } from '../dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(private readonly repository: WorkflowsRepository) {}

  async create(tenantId: string, userId: string, dto: CreateWorkflowDto) {
    return this.repository.create(tenantId, userId, dto);
  }

  async findAll(tenantId: string) {
    return this.repository.findAll(tenantId);
  }

  async findOne(id: string, tenantId: string) {
    const workflow = await this.repository.findOneByIdAndTenant(id, tenantId);
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    return workflow;
  }

  async update(id: string, tenantId: string, dto: UpdateWorkflowDto) {
    // Verify first
    await this.findOne(id, tenantId);
    return this.repository.update(id, tenantId, dto);
  }

  async remove(id: string, tenantId: string) {
    // Verify first
    await this.findOne(id, tenantId);
    return this.repository.softDelete(id, tenantId);
  }
}
