import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../../user/core/RoleEnum';

export const REQUIRED_ROLES_KEY = 'REQUIRED_ROLES_KEY';
export const RequiredRoles = (...roles: RoleEnum[]): Function =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);
