import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './service/mailer/MailerService';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailModule {}
