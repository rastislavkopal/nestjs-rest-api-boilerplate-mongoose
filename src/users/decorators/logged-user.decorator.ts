import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const LoggedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }
    return request.user;
  },
);
