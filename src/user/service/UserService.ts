import { UserServiceInterface } from './UserServiceInterface';
import { User } from '../entity/User';
import { Injectable } from '@nestjs/common';
import { AddNewUserOptions } from './options';
import { Gallery } from '../../gallery/entity/Gallery';
import { UserRepo } from '../repository/UserRepo';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepo,
  ) {}

  public async addNewUser({
    email,
    name,
    password,
  }: AddNewUserOptions): Promise<void> {
    const doesUserAlreadyExist = Boolean(await this.findUserByEmail(email));
    if (doesUserAlreadyExist) throw new Error('User already exists!');

    let newUser = User.createOneWith({ name, email, password });
    const gallery = Gallery.createOneWith({ user: newUser });

    newUser = newUser.withGallery(gallery);

    await this.userRepo.save(newUser);
  }

  public async findUserById(
    id: number,
    includeGallery = false,
  ): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
      relations: {
        gallery: includeGallery,
      },
    });
  }
  public async findUserByEmail(
    email: string,
    includeGallery = false,
  ): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email },
      relations: {
        gallery: includeGallery,
      },
    });
  }

  public async removeUserById(id: number): Promise<void> {
    const doesUserAlreadyExist = Boolean(await this.findUserById(id));
    if (!doesUserAlreadyExist) throw new Error("User doesn't exist!");

    await this.userRepo.delete({ id });
  }
}
