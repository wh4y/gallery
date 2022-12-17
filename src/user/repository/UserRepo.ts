import { UserRepoInterface } from './UserRepoInterface';
import { User } from '../entity/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepo implements UserRepoInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async deleteById(id: number): Promise<void> {
    await this.userRepo.delete({ id });
  }

  async findById(id: number): Promise<User | null> {
    return (await this.userRepo.findOneBy({ id })) as User;
  }

  async save(user: User): Promise<User> {
    return await this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }
}
