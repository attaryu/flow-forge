import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaProvider } from '../../../shared/providers/prisma/prisma.provider';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class OnboardingRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async registerUserAndOrganization(
    email: string,
    passwordHash: string,
    name: string,
    organizationName: string,
  ): Promise<UserResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Check if user already exists
      const existingUser = await tx.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email is already registered');
      }

      // 2. Retrieve owner role
      const ownerRole = await tx.role.findUnique({
        where: { name: 'owner' },
      });
      if (!ownerRole) {
        throw new InternalServerErrorException(
          'Master role "owner" not found. Please run migrations/seeding.',
        );
      }

      // 3. Create the user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
        },
      });

      // 4. Create the organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          createdBy: user.id,
        },
      });

      // 5. Link user to organization as owner
      await tx.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          roleId: ownerRole.id,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      };
    });
  }
}
