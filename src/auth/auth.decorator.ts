import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { getRequest } from './auth.util';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContextHost) => {
    const req = getRequest(ctx);

    return req.userId;
  }
);
