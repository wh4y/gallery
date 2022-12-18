import { User } from '../entity/User';
import { AddNewUserOptions } from './options';

export interface UserServiceInterface {
  addNewUser(options: AddNewUserOptions): Promise<void>;

  removeUserById(id: number): Promise<void>;

  findUserById(id: number, includeGallery?: boolean): Promise<User | null>;

  findUserByEmail(
    email: string,
    includeGallery?: boolean,
  ): Promise<User | null>;
}
