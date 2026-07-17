import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../../shared/guards/organization.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentOrgId } from '../../../shared/decorators/current-org.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserResponseDto } from '../../auth/dto/user-response.dto';
import { RunsService } from '../services/runs.service';
import { SseService } from '../services/sse.service';
import { Observable } from 'rxjs';

@Controller('runs')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class RunsController {
  constructor(
    private readonly runsService: RunsService,
    private readonly sseService: SseService,
  ) {}

  @Post('workflows/:workflowId/trigger')
  @Roles('owner', 'editor')
  async trigger(
    @Param('workflowId') workflowId: string,
    @CurrentOrgId() tenantId: string,
    @CurrentUser() user: UserResponseDto,
  ) {
    return this.runsService.triggerRun(workflowId, tenantId, user.id);
  }

  @Get('workflows/:workflowId')
  @Roles('owner', 'editor', 'viewer')
  async getWorkflowRuns(
    @Param('workflowId') workflowId: string,
    @CurrentOrgId() tenantId: string,
  ) {
    return this.runsService.getWorkflowRuns(workflowId, tenantId);
  }

  @Get(':id')
  @Roles('owner', 'editor', 'viewer')
  async getRunDetail(
    @Param('id') id: string,
    @CurrentOrgId() tenantId: string,
  ) {
    return this.runsService.getRunDetail(id, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('owner', 'editor')
  async deleteRun(
    @Param('id') id: string,
    @CurrentOrgId() tenantId: string,
  ) {
    return this.runsService.deleteRun(id, tenantId);
  }

  @Get(':id/events')
  @Sse()
  @Roles('owner', 'editor', 'viewer')
  streamEvents(
    @Param('id') id: string,
    @CurrentOrgId() tenantId: string, // Guard memastikan user punya akses ke tenant
  ): Observable<MessageEvent> {
    // SSE streams live events
    return this.sseService.subscribeToRunEvents(id);
  }
}
