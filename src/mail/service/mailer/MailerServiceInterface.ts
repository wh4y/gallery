import * as Mail from 'nodemailer/lib/mailer';

export interface MailerServiceInterface {
  sendMail(options: Mail.Options): Promise<void>;
}
