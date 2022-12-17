import { Provider } from '@nestjs/common';
import { UserRepo } from './UserRepo';

export const USER_REPO = 'USER_REPO';

export const UserRepoProvider: Provider = {
  provide: USER_REPO,
  useClass: UserRepo,
};
