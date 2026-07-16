import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { AuthResponseDto } from '@/features/auth/dto/auth-response.dto';
import { RegisterInputDto } from '@/features/auth/dto/register-input.dto';
import { OnboardingRepository } from '@/features/auth/repositories/onboarding.repository';
import { AuthService } from '@/features/auth/services/auth.service';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly onboardingRepository: OnboardingRepository,
    private readonly authService: AuthService,
  ) {}

  async register(
    input: RegisterInputDto,
  ): Promise<{ response: AuthResponseDto; refreshToken: string }> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const organizationName =
      input.organizationName || `${input.name}'s Organization`;

    try {
      const user = await this.onboardingRepository.registerUserAndOrganization(
        input.email,
        passwordHash,
        input.name,
        organizationName,
      );

      return this.authService.generateTokensAndSession(
        user.id,
        user.email,
        user.name,
        user.createdAt,
      );
    } catch (error) {
      // Re-throw NestJS exceptions directly, otherwise wrap them
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to register user and organization',
      );
    }
  }
}
