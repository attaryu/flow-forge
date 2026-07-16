import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@/features/auth/controllers/auth.controller';
import { AuthRepository } from '@/features/auth/repositories/auth.repository';
import { OnboardingRepository } from '@/features/auth/repositories/onboarding.repository';
import { AuthService } from '@/features/auth/services/auth.service';
import { OnboardingService } from '@/features/auth/services/onboarding.service';
import { JwtStrategy } from '@/features/auth/strategies/jwt.strategy';
import { DurationUtils } from '@/features/auth/utils/duration.utils';
import { PrismaModule } from '@/shared/providers/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresInEnv = configService.getOrThrow<string>(
          'JWT_ACCESS_EXPIRES_IN',
        );
        const parsedExpiresIn = /^\d+$/.test(expiresInEnv)
          ? Math.floor(parseInt(expiresInEnv, 10) / 1000)
          : expiresInEnv;

        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: parsedExpiresIn as number | '30m',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    OnboardingService,
    AuthService,
    OnboardingRepository,
    AuthRepository,
    JwtStrategy,
    DurationUtils,
  ],
  exports: [AuthService, JwtStrategy, PassportModule, DurationUtils],
})
export class AuthModule {}
