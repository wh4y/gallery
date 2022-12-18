import { UserRepoInterface } from './UserRepoInterface';
import { User } from '../entity/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { findUserDefaultOptions, FindUserOptions } from './options';

export class UserRepo implements UserRepoInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async deleteById(id: number): Promise<void> {
    await this.userRepo.delete({ id });
  }

  async findById(
    id: number,
    options: FindUserOptions = findUserDefaultOptions,
  ): Promise<User | null> {
    return await this.userRepo.findOne({ ...options, where: { id } });
  }

  async save(user: User): Promise<User> {
    return await this.userRepo.save(user);
  }

  async findByEmail(
    email: string,
    options: FindUserOptions = findUserDefaultOptions,
  ): Promise<User | null> {
    return await this.userRepo.findOne({
      ...options,
      where: { email },
    });
  }
}
