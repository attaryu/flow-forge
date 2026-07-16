import { Injectable } from '@nestjs/common';
import { OrganizationsRepository } from '../repositories/organizations.repository';
import { OrganizationResponseDto } from '../dto/organization-response.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async getUserOrganizations(
    userId: string,
  ): Promise<OrganizationResponseDto[]> {
    return this.organizationsRepository.findUserOrganizations(userId);
  }
}
