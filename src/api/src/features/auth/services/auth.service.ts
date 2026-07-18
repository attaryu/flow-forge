import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginInputDto } from '../dto/login-input.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { DurationUtils } from '../utils/duration.utils';

interface TokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly durationUtils: DurationUtils,
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    this.accessExpiresIn = this.configService.getOrThrow<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    this.refreshExpiresIn = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );
  }

  getRefreshExpiresInMs(): number {
    return this.durationUtils.parseToMs(this.refreshExpiresIn);
  }

  async login(
    input: LoginInputDto,
  ): Promise<{ response: AuthResponseDto; refreshToken: string }> {
    const user = await this.authRepository.findUserByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokensAndSession(
      user.id,
      user.email,
      user.name,
      user.createdAt,
    );
  }

  async refresh(
    token: string,
  ): Promise<{ response: AuthResponseDto; refreshToken: string }> {
    if (!token) {
      throw new BadRequestException('Refresh token is required');
    }

    const session = await this.authRepository.findSessionByToken(token);
    if (!session || session.revoked || new Date() > session.expiresAt) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke the old refresh token (rotation)
    await this.authRepository.revokeSession(token);

    // Generate new pair of tokens
    return this.generateTokensAndSession(
      session.user.id,
      session.user.email,
      session.user.name,
      session.user.createdAt,
    );
  }

  async logout(token: string): Promise<void> {
    if (token) {
      await this.authRepository.revokeSession(token);
    }
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.authRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  async generateTokensAndSession(
    userId: string,
    email: string,
    name: string,
    createdAt: Date,
  ): Promise<{ response: AuthResponseDto; refreshToken: string }> {
    const payload: TokenPayload = { sub: userId, email };

    const getExpiresInOption = (expiresInEnv: string): string | number => {
      if (/^\d+$/.test(expiresInEnv)) {
        return this.durationUtils.parseToSec(expiresInEnv);
      }
      return expiresInEnv;
    };

    // 1. Generate access token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: getExpiresInOption(this.accessExpiresIn) as number | '30m',
    });

    // 2. Generate refresh token
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: getExpiresInOption(this.refreshExpiresIn) as number | '3d',
    });

    // Calculate expiry date for session
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + this.getRefreshExpiresInMs());

    // 3. Save session in DB
    await this.authRepository.createUserSession(
      userId,
      refreshToken,
      expiresAt,
    );

    const userResponse: UserResponseDto = {
      id: userId,
      email,
      name,
      createdAt,
    };

    return {
      response: {
        accessToken,
        user: userResponse,
      },
      refreshToken,
    };
  }
}
