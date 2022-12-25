import { AuthControllerInterface } from './AuthControllerInterface';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from '../service/auth/AuthService';
import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { SignInOptions, SignUpOptions } from '../service/auth/types';
import { TokenService } from '../service/token/TokenService';
import { AccessTokenCookie } from './cookie/AccessTokenCookie';
import { RefreshTokenCookie } from './cookie/RefreshTokenCookie';
import { Request, Response } from 'express';
import { User } from '../../user/entity/User';
import { TokenTypes } from '../core/TokenTypes';
import { AuthExceptionFilter } from './exceptionFilter/AuthExceptionFilter';

@UseFilters(AuthExceptionFilter)
@Controller('/auth')
export class AuthController implements AuthControllerInterface {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('/refresh-tokens')
  public async refreshToken(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const refreshToken = req.cookies[RefreshTokenCookie.REFRESH_TOKEN];
    if (!refreshToken)
      throw new BadRequestException('Cookie with refresh token required!');

    const user = await this.tokenService
      .verifyJWT<User>(refreshToken, TokenTypes.REFRESH)
      .catch(() => {
        throw new BadRequestException('Refresh token expired!');
      });

    const [newAccessToken, newRefreshToken] =
      this.tokenService.generateTokensFromFromUser(user);

    const accessTokenCookie = new AccessTokenCookie(newAccessToken);
    const refreshTokenCookie = new RefreshTokenCookie(newRefreshToken);

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

    res.end();
  }

  @Post('/signin')
  public async signIn(
    @Body() dto: SignInDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.authService.signIn(dto as SignInOptions);
    const [accessToken, refreshToken] =
      this.tokenService.generateTokensFromFromUser(user);

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

  @Post('/signout')
  public async singOut(@Res() res: Response): Promise<void> {
    res.clearCookie(AccessTokenCookie.ACCESS_TOKEN);
    res.clearCookie(RefreshTokenCookie.REFRESH_TOKEN);

    res.end();
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
