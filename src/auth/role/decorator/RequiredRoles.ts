import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/Role';

export const REQUIRED_ROLES_KEY = 'REQUIRED_ROLES_KEY';
export const RequiredRoles = (...roles: Role[]): Function =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);
