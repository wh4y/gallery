import { Module } from '@nestjs/common';
import { UserModule } from '../user/UserModule';
import { AuthController } from './controller/AuthController';
import { AuthService } from './service/AuthService';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
