import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/providers/prisma/prisma.service';
import { User, UserSession } from '../../../../prisma/generated/client';

export type UserSessionWithUser = UserSession & { user: User };

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUserSession(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<UserSession> {
    return this.prisma.userSession.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findSessionByToken(token: string): Promise<UserSessionWithUser | null> {
    return this.prisma.userSession.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
  }

  async revokeSession(token: string): Promise<void> {
    await this.prisma.userSession.update({
      where: { token },
      data: { revoked: true },
    });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}
