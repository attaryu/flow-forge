import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { UserResponseDto } from '../dto/user-response.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as UserResponseDto | undefined;
  },
);
