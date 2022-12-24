import { Module } from '@nestjs/common';
import { UserModule } from '../user/UserModule';
import { AuthController } from './controller/AuthController';
import { AuthService } from './service/auth/AuthService';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/token/TokenService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenList } from './entity/TokenList';

@Module({
  imports: [UserModule, JwtModule, TypeOrmModule.forFeature([TokenList])],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [TokenService, UserModule],
})
export class AuthModule {}
