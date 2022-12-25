import { TokenServiceInterface } from './TokenServiceInterface';
import { EmailVerificationJwtPayload, UserJwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entity/User';
import { TokenTypes } from '../../core/TokenTypes';

@Injectable()
export class TokenService implements TokenServiceInterface {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateJWT<P extends Object>(payload: P, type: TokenTypes): string {
    const expiresIn = this.configService.get<string>(
      `JWT_${type.toUpperCase()}_EXPIRES_IN`,
    );
    const secret = this.configService.get<string>(
      `JWT_${type.toUpperCase()}_SECRET`,
    );

    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  public generateAccessToken(payload: UserJwtPayload): string {
    return this.generateJWT(payload, TokenTypes.ACCESS);
  }

  public generateRefreshToken(payload: UserJwtPayload): string {
    return this.generateJWT(payload, TokenTypes.REFRESH);
  }

  public generateEmailVerificationToken(
    payload: EmailVerificationJwtPayload,
  ): string {
    return this.generateJWT(payload, TokenTypes.VERIFICATION_TOKEN);
  }

  public async verifyJWT<T extends Object>(
    token: string,
    type: string,
  ): Promise<T> {
    const secret = this.configService.get<string>(
      `JWT_${type.toUpperCase()}_SECRET`,
    );

    return await this.jwtService.verifyAsync(token, { secret });
  }

  public generateTokensFromFromUser(user: User): string[] {
    const payload = { userId: user.id };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return [accessToken, refreshToken];
  }

  public decodeToken(token: string): UserJwtPayload {
    return this.jwtService.decode(token) as UserJwtPayload;
  }
}
