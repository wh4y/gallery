import { User } from '../entity/User';
import { FindUserOptions } from './options';

export interface UserRepoInterface {
  save(user: User): Promise<User>;

  deleteById(id: number): Promise<void>;

  findById(id: number): Promise<User | null>;

  findByEmail(email: string, options?: FindUserOptions): Promise<User | null>;
}
