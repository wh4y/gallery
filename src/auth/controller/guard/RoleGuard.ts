import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_ROLES_KEY } from '../decorator/RequiredRoles';
import { RoleEnum } from '../../../user/core/RoleEnum';
import { User } from '../../../user/entity/User';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      REQUIRED_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    return requiredRoles.some(role =>
      user.roles.some(userRole => userRole.name === role),
    );
  }
}
