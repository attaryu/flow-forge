import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../../shared/guards/organization.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentOrgId } from '../../../shared/decorators/current-org.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserResponseDto } from '../../auth/dto/user-response.dto';
import { WorkflowsService } from '../services/workflows.service';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { UpdateWorkflowDto } from '../dto/update-workflow.dto';
import { WorkflowResponseDto } from '../dto/workflow-response.dto';

@Controller('workflows')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @Roles('owner', 'editor')
  async create(
    @CurrentOrgId() tenantId: string,
    @CurrentUser() user: UserResponseDto,
    @Body() dto: CreateWorkflowDto,
  ): Promise<WorkflowResponseDto> {
    return this.workflowsService.create(tenantId, user.id, dto);
  }

  @Get()
  @Roles('owner', 'editor', 'viewer')
  async findAll(
    @CurrentOrgId() tenantId: string,
  ): Promise<WorkflowResponseDto[]> {
    return this.workflowsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles('owner', 'editor', 'viewer')
  async findOne(
    @Param('id') id: string,
    @CurrentOrgId() tenantId: string,
  ): Promise<WorkflowResponseDto> {
    return this.workflowsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles('owner', 'editor')
  async update(
    @Param('id') id: string,
    @CurrentOrgId() tenantId: string,
    @Body() dto: UpdateWorkflowDto,
  ): Promise<WorkflowResponseDto> {
    return this.workflowsService.update(id, tenantId, dto);
  }

  @Delete(':id')
  @Roles('owner')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentOrgId() tenantId: string,
  ): Promise<void> {
    await this.workflowsService.remove(id, tenantId);
  }
}
