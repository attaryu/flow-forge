import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../../shared/guards/organization.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentOrgId } from '../../../shared/decorators/current-org.decorator';
import { DashboardService } from '../services/dashboard.service';
import { DashboardStatsDto } from '../dto/dashboard-stats.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('owner', 'editor', 'viewer')
  async getStats(
    @CurrentOrgId() tenantId: string,
  ): Promise<DashboardStatsDto> {
    return this.dashboardService.getStats(tenantId);
  }
}
