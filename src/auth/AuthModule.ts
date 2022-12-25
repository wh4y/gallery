import { Module } from '@nestjs/common';
import { UserModule } from '../user/UserModule';
import { AuthController } from './controller/auth/AuthController';
import { AuthService } from './service/auth/AuthService';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/token/TokenService';
import { MailModule } from '../mail/MailModule';
import { EmailConfirmationController } from './controller/emailConfirmation/emailConfirmationController';
import { EmailConfirmationService } from './service/emailConfirmation/EmailConfirmationService';

@Module({
  imports: [UserModule, JwtModule, MailModule],
  controllers: [AuthController, EmailConfirmationController],
  providers: [AuthService, TokenService, EmailConfirmationService],
  exports: [TokenService, UserModule],
})
export class AuthModule {}
