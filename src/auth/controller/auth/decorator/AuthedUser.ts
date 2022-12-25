import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../../../user/entity/User';

export const AuthedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
