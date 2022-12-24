import { TokenServiceInterface } from './TokenServiceInterface';
import { AttachTokenToUserOptions, JwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user/service/UserService';
import { User } from '../../../user/entity/User';
import { TokenListRepo } from '../../repository/TokenListRepo';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenList } from '../../entity/TokenList';

@Injectable()
export class TokenService implements TokenServiceInterface {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectRepository(TokenList)
    private readonly tokenListRepo: TokenListRepo,
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

  public async attachTokensToUser({
    userId,
    accessToken,
    refreshToken,
  }: AttachTokenToUserOptions): Promise<void> {
    await this.tokenListRepo.save(
      TokenList.createOneWith({ userId, accessToken, refreshToken }),
    );
  }

  public generateTokensFromUser(user: User): string[] {
    const payload = { userId: user.id };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return [accessToken, refreshToken];
  }

  public decodeAccessToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }
}
