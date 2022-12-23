import { User } from '../entity/User';

export type AddNewUserOptions = Pick<User, 'email' | 'password' | 'name'>;
