import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { validateWorkflow } from '@flow-forge/shared-validation';
import { WorkflowsRepository } from '../repositories/workflows.repository';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { UpdateWorkflowDto } from '../dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(private readonly repository: WorkflowsRepository) {}

  async create(tenantId: string, userId: string, dto: CreateWorkflowDto) {
    const validation = validateWorkflow(dto);
    if (!validation.valid) {
      throw new BadRequestException(validation.errors);
    }
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
    const existing = await this.findOne(id, tenantId);

    if (dto.definition !== undefined) {
      const validation = validateWorkflow({
        name: dto.name ?? existing.name,
        description: dto.description ?? existing.description,
        definition: dto.definition,
      });
      if (!validation.valid) {
        throw new BadRequestException(validation.errors);
      }
    }

    return this.repository.update(id, tenantId, dto);
  }

  async remove(id: string, tenantId: string) {
    // Verify first
    await this.findOne(id, tenantId);
    return this.repository.softDelete(id, tenantId);
  }
}
