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

      // 6. Create default workflow for the user/organization
      await tx.workflow.create({
        data: {
          tenantId: organization.id,
          createdBy: user.id,
          name: 'Cek Fakta Kucing',
          description: 'Contoh workflow yang memakai semua jenis node (HTTP_CALL, CONDITIONAL_BRANCH, DELAY, DATA_TRANSFORM). Ambil fakta acak dari catfact.ninja (API publik, gratis, tanpa API key), lalu cabang berdasarkan panjang teksnya.',
          status: 'active',
          definition: {
            nodes: [
              {
                id: 'http-1',
                type: 'HTTP_CALL',
                config: {
                  url: 'https://catfact.ninja/fact',
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                  },
                },
              },
              {
                id: 'cond-1',
                type: 'CONDITIONAL_BRANCH',
                config: {
                  operator: 'GREATER_THAN',
                  left: '${http-1.data.length}',
                  right: '100',
                },
              },
              {
                id: 'transform-long',
                type: 'DATA_TRANSFORM',
                config: {
                  mode: 'simple',
                  operation: 'CONCAT',
                  inputs: [
                    { value: 'Fakta panjang: ' },
                    { value: '${http-1.data.fact}' },
                  ],
                },
              },
              {
                id: 'delay-1',
                type: 'DELAY',
                config: {
                  seconds: 5,
                },
              },
              {
                id: 'transform-short',
                type: 'DATA_TRANSFORM',
                config: {
                  mode: 'advanced',
                  expression: '${http-1.data.length} <= 100 ? "Fakta pendek: " + ${http-1.data.fact} : "N/A"',
                },
              },
            ],
            edges: [
              { from: 'http-1', to: 'cond-1' },
              { from: 'cond-1', to: 'transform-long', sourceHandle: 'true' },
              { from: 'cond-1', to: 'delay-1', sourceHandle: 'false' },
              { from: 'delay-1', to: 'transform-short' },
            ],
          },
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        organizationId: organization.id,
      };
    });
  }
}
