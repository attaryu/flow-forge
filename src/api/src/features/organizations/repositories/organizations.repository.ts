import { Injectable } from '@nestjs/common';
import { PrismaProvider } from '../../../shared/providers/prisma/prisma.provider';

@Injectable()
export class OrganizationsRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async findUserOrganizations(userId: string) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      include: {
        organization: true,
        role: true,
      },
    });

    return memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role.name as 'owner' | 'editor' | 'viewer',
    }));
  }
}
