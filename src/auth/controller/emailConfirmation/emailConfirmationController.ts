import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { EmailConfirmationService } from '../../service/emailConfirmation/EmailConfirmationService';
import { TokenService } from '../../service/token/TokenService';
import { TokenTypes } from '../../core/TokenTypes';
import { EmailVerificationJwtPayload } from '../../service/token/types';

@Controller('/confirm-email')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('/:token')
  public async confirmEmail(@Param('token') token: string): Promise<string> {
    const { email } = await this.tokenService
      .verifyJWT<EmailVerificationJwtPayload>(
        token,
        TokenTypes.VERIFICATION_TOKEN,
      )
      .catch(() => {
        throw new BadRequestException('Verification token expired!');
      });

    await this.emailConfirmationService.confirmEmail(email);

    return 'Email confirmed!';
  }
}
