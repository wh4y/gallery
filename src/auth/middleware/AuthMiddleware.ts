import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AccessTokenCookie } from '../controller/cookie/AccessTokenCookie';
import { TokenService } from '../service/token/TokenService';
import { JwtPayload } from '../service/token/options';
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
      .verifyAccessJWT<JwtPayload>(accessToken)
      .catch(() => {
        throw new UnauthorizedException();
      });

    const user = await this.usersService.findUserById(payload.userId);
    if (!user) throw new Error();

    req.user = user;

    next();
  }

  private extractAccessTokenFromReq(req: Request): string {
    return req.cookies[AccessTokenCookie.ACCESS_TOKEN] as string;
  }
}
