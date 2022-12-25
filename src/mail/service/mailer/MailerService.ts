import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { MailerServiceInterface } from './MailerServiceInterface';

@Injectable()
export class MailerService implements MailerServiceInterface {
  private readonly nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: configService.get<string>('EMAIL_SERVICE_HOST'),
      port: 587,
      auth: {
        user: configService.get<string>('EMAIL_SERVICE_USER'),
        pass: configService.get<string>('EMAIL_SERVICE_PASS'),
      },
    });
  }

  async sendMail(options: Mail.Options): Promise<void> {
    await this.nodemailerTransport.sendMail(options);
  }
}
