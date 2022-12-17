import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User';
import { UserRepoProvider } from './repository/UserRepoProvider';
import { UserService } from './service/UserService';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepoProvider, UserService],
})
export class UserModule {}
