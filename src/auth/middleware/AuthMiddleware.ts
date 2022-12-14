import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AccessTokenCookie } from '../controller/auth/cookie/AccessTokenCookie';
import { TokenService } from '../service/token/TokenService';
import { UserJwtPayload } from '../service/token/types';
import { UserService } from '../../user/service/UserService';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const accessToken = this.extractAccessTokenFromReq(req);
    if (!accessToken) throw new UnauthorizedException();

    const payload = await this.tokenService
      .verifyJWT<UserJwtPayload>(accessToken, 'ACCESS')
      .catch(() => {
        throw new UnauthorizedException();
      });

    const user = await this.usersService.findUserById(payload.userId, true);
    if (!user) throw new Error();

    req.user = user;

    next();
  }

  private extractAccessTokenFromReq(req: Request): string {
    return req.cookies[AccessTokenCookie.ACCESS_TOKEN] as string;
  }
}
