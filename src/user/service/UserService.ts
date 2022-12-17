import { UserServiceInterface } from './UserServiceInterface';
import { User } from '../entity/User';
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPO } from '../repository/UserRepoProvider';
import { UserRepoInterface } from '../repository/UserRepoInterface';
import { AddNewUserOptions } from './options';
import { Gallery } from '../../gallery/entity/Gallery';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject(USER_REPO)
    private readonly userRepo: UserRepoInterface,
  ) {}

  public async addNewUser({
    email,
    name,
    password,
  }: AddNewUserOptions): Promise<void> {
    const doesUserAlreadyExist = Boolean(
      await this.userRepo.findByEmail(email),
    );
    if (doesUserAlreadyExist) throw new Error('User already exists!');

    let newUser = User.createOneWith({ name, email, password });
    const gallery = Gallery.createOneWith({ user: newUser });

    newUser = newUser.withGallery(gallery);

    await this.userRepo.save(newUser);
  }

  public async findUserById(id: number): Promise<User | null> {
    return await this.userRepo.findById(id);
  }
  public async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findByEmail(email);
  }

  public async removeUserById(id: number): Promise<void> {
    const doesUserAlreadyExist = Boolean(await this.userRepo.findById(id));
    if (!doesUserAlreadyExist) throw new Error("User doesn't exist!");

    await this.userRepo.deleteById(id);
  }
}
