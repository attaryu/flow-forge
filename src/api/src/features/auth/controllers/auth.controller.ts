import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as express from 'express';

import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginInputDto } from '../dto/login-input.dto';
import { RegisterInputDto } from '../dto/register-input.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { OnboardingService } from '../services/onboarding.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly authService: AuthService,
  ) {}

  private setRefreshTokenCookie(res: express.Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.authService.getRefreshExpiresInMs(), // Dinamis dari env via DurationUtils
      path: '/api/v1/auth', // scoping cookie to auth endpoints to enhance security
    });
  }

  private clearRefreshTokenCookie(res: express.Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
  }

  @Post('register')
  async register(
    @Body() input: RegisterInputDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<AuthResponseDto> {
    const { response, refreshToken } =
      await this.onboardingService.register(input);
    this.setRefreshTokenCookie(res, refreshToken);
    return response;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() input: LoginInputDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<AuthResponseDto> {
    const { response, refreshToken } = await this.authService.login(input);
    this.setRefreshTokenCookie(res, refreshToken);
    return response;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<AuthResponseDto> {
    const cookies = req.cookies as Record<string, string> | undefined;
    const token = cookies?.['refreshToken'];
    const { response, refreshToken } = await this.authService.refresh(
      token || '',
    );
    this.setRefreshTokenCookie(res, refreshToken);
    return response;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<void> {
    const cookies = req.cookies as Record<string, string> | undefined;
    const token = cookies?.['refreshToken'];
    await this.authService.logout(token || '');
    this.clearRefreshTokenCookie(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
    return user;
  }
}
