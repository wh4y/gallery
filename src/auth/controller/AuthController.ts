import { AuthControllerInterface } from './AuthControllerInterface';
import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '../service/auth/AuthService';
import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { SignInOptions, SignUpOptions } from '../service/auth/types';
import { TokenService } from '../service/token/TokenService';
import { AuthedUser } from './decorator/AuthedUser';
import { AccessTokenCookie } from './cookie/AccessTokenCookie';
import { RefreshTokenCookie } from './cookie/RefreshTokenCookie';
import { Response } from 'express';
import { JwtPayload } from '../service/token/types';

@Controller('/auth')
export class AuthController implements AuthControllerInterface {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('/refresh-tokens')
  public async refreshToken(
    @Res() res: Response,
    @AuthedUser() payload: JwtPayload,
  ): Promise<void> {
    const a = 2;
  }

  @Post('/signin')
  public async signIn(
    @Body() dto: SignInDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.authService.signIn(dto as SignInOptions);
    const [accessToken, refreshToken] =
      this.tokenService.generateTokensFromUser(user);

    await this.tokenService.attachTokensToUser({
      accessToken,
      refreshToken,
      userId: user.id,
    });

    const accessTokenCookie = new AccessTokenCookie(accessToken);
    const refreshTokenCookie = new RefreshTokenCookie(refreshToken);

    res.cookie(
      accessTokenCookie.name,
      accessTokenCookie.val,
      accessTokenCookie.options,
    );
    res.cookie(
      refreshTokenCookie.name,
      refreshTokenCookie.val,
      refreshTokenCookie.options,
    );

    res.send(user);
  }

  public async singOut(): Promise<void> {
    throw new NotImplementedException();
  }

  @Post('/signup')
  public async singUp(
    @Body() dto: SignUpDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.signUp(dto as SignUpOptions);

    return await this.signIn(dto, res);
  }
}
