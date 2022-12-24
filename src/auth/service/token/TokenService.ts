import { TokenServiceInterface } from './TokenServiceInterface';
import { JwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService implements TokenServiceInterface {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateJWT<P extends Object>(payload: P, type: string): string {
    const expiresIn = this.configService.get<string>(
      `JWT_${type.toUpperCase()}_EXPIRES_IN`,
    );
    const secret = this.configService.get<string>(
      `JWT_${type.toUpperCase()}_SECRET`,
    );

    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  public generateAccessToken(payload: JwtPayload): string {
    return this.generateJWT(payload, 'ACCESS');
  }

  public generateRefreshToken(payload: JwtPayload): string {
    return this.generateJWT(payload, 'REFRESH');
  }

  public async verifyAccessJWT<T extends Object>(token: string): Promise<T> {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    return await this.jwtService.verifyAsync(token, { secret });
  }

  public generateTokensFromFromUserId(userId: number): string[] {
    const payload = { userId };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return [accessToken, refreshToken];
  }

  public decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }
}
