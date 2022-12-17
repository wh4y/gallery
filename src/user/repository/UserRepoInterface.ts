import { User } from '../entity/User';

export interface UserRepoInterface {
  save(user: User): Promise<User>;

  deleteById(id: number): Promise<void>;

  findById(id: number): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;
}
