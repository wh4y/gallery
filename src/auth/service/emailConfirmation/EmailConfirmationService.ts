import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../../../mail/service/mailer/MailerService';
import { UserService } from '../../../user/service/UserService';
import { EmailVerificationJwtPayload } from '../token/types';
import { TokenService } from '../token/TokenService';
import { EmailConfirmationServiceInterface } from './EmailConfirmationServiceInterface';

@Injectable()
export class EmailConfirmationService
  implements EmailConfirmationServiceInterface
{
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly usersService: UserService,
  ) {}

  public async confirmEmail(email: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new NotFoundException();
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed!');
    }
    await this.usersService.updateEmailConfirmationStatus(user, true);
  }

  public async sendConfirmationMail(to: string): Promise<void> {
    const payload: EmailVerificationJwtPayload = { email: to };
    const token = this.tokenService.generateEmailVerificationToken(payload);

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}/${token}`;

    const html = `<p>Welcome to the gallery. To confirm the email address, <a href="${url}">click here!</a></p>`;

    await this.mailerService.sendMail({
      to,
      subject: 'Email confirmation',
      html,
    });
  }
}
