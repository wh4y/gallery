import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../../user/core/Roles';

export const REQUIRED_ROLES_KEY = 'REQUIRED_ROLES_KEY';
export const RequiredRoles = (...roles: Roles[]): Function =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);
