import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { TokenService } from '../../service/token/TokenService';
import { User } from '../../../user/entity/User';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { AccessTokenCookie } from '../cookie/AccessTokenCookie';
import { RefreshTokenCookie } from '../cookie/RefreshTokenCookie';

@Injectable()
export class AttachJwtInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<User> {
    return next.handle().pipe(
      map(user => {
        const res = context.switchToHttp().getResponse<Response>();

        const payload = { userId: user.id };
        const accessToken = this.tokenService.generateAccessToken(payload);
        const refreshToken = this.tokenService.generateRefreshToken(payload);

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

        return user;
      }),
    );
  }
}
