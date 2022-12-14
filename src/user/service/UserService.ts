import { UserServiceInterface } from './UserServiceInterface';
import { User } from '../entity/User';
import { Injectable } from '@nestjs/common';
import { AddNewUserOptions } from './types';
import { Gallery } from '../../gallery/entity/Gallery';
import { UserRepo } from '../repository/UserRepo';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryBlockedUserList } from '../../gallery/entity/GalleryBlockedUserList';
import { Role } from '../entity/Role';
import { Roles } from '../core/Roles';
import {
  UserAlreadyExistsException,
  UserDoesntExistException,
} from './exceptions';

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
    if (doesUserAlreadyExist) throw new UserAlreadyExistsException();

    let newUser = User.createOneWith({
      name,
      email,
      password,
      roles: [Role.createOneWith({ name: Roles.INTERNAL_USER })],
    });

    const blockedUserList = GalleryBlockedUserList.createOneWith({});
    const gallery = Gallery.createOneWith({ owner: newUser, blockedUserList });

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
        roles: true,
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
        roles: true,
      },
    });
  }

  public async updateEmailConfirmationStatus(
    user: User,
    status: boolean,
  ): Promise<void> {
    const updatedUser = user.withIsEmailConfirmed(status);
    await this.userRepo.save(updatedUser);
  }

  public async removeUserById(id: number): Promise<void> {
    const doesUserAlreadyExist = Boolean(await this.findUserById(id));
    if (!doesUserAlreadyExist) throw new UserDoesntExistException();

    await this.userRepo.delete({ id });
  }
}
