import { User } from '../entity/User';
import { AddNewUserOptions } from './options';

export interface UserServiceInterface {
  addNewUser(options: AddNewUserOptions): Promise<void>;

  removeUserById(id: number): Promise<void>;

  findUserById(id: number): Promise<User>;

  findUserByEmail(email: string): Promise<User>;
}
