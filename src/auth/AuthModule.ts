import { Module } from '@nestjs/common';
import { UserModule } from '../user/UserModule';
import { AuthController } from './controller/AuthController';
import { AuthService } from './service/auth/AuthService';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/token/TokenService';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [TokenService, UserModule],
})
export class AuthModule {}
