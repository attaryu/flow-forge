import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserResponseDto } from '../../auth/dto/user-response.dto';
import { OrganizationsService } from '../services/organizations.service';
import { OrganizationResponseDto } from '../dto/organization-response.dto';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async getMyOrganizations(
    @CurrentUser() user: UserResponseDto,
  ): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.getUserOrganizations(user.id);
  }
}
