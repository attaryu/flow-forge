import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaProvider } from '../providers/prisma/prisma.provider';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User authentication required');
    }

    let organizationId = request.headers['x-organization-id'] as string;
    if (!organizationId && request.query && request.query.orgId) {
      organizationId = request.query.orgId as string;
    }

    if (!organizationId) {
      throw new BadRequestException('X-Organization-Id header is required');
    }

    // Verify membership and fetch role
    const member = await this.prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId,
        },
      },
      include: {
        role: true,
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    // Attach organizationId and role to request
    request.organizationId = organizationId;
    request.userRole = member.role.name;

    // Check roles if specified
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(member.role.name);
      if (!hasRole) {
        throw new ForbiddenException(
          'You do not have permission to perform this action',
        );
      }
    }

    return true;
  }
}
