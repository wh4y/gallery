import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User';
import { UserService } from './service/UserService';
import { UserRepo } from './repository/UserRepo';
import { Role } from './entity/Role';
import { Roles } from './core/Roles';
import { GalleryBlockedUserList } from '../gallery/entity/GalleryBlockedUserList';
import { Gallery } from '../gallery/entity/Gallery';
import { genSalt, hash } from 'bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepo,
  ) {}

  async onModuleInit(): Promise<void> {
    const rootUser = await this.userRepo.findOneBy({ email: 'root@root.com' });
    if (rootUser) return;

    let newUser = User.createOneWith({
      name: 'ROOT',
      email: 'root@root.com',
      password: await hash('ROOTPASS', await genSalt()),
      roles: [Role.createOneWith({ name: Roles.ADMIN })],
    });

    const blockedUserList = GalleryBlockedUserList.createOneWith({});
    const gallery = Gallery.createOneWith({ owner: newUser, blockedUserList });

    newUser = newUser.withGallery(gallery);

    await this.userRepo.save(newUser);
  }
}
