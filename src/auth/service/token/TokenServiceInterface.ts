import { JwtPayload } from './types';

export interface TokenServiceInterface {
  generateAccessToken(payload: JwtPayload): string;

  generateRefreshToken(payload: JwtPayload): string;

  verifyAccessJWT(token: string): Promise<string>;

  generateTokensFromFromUserId(userId: number): string[];

  decodeToken(token: string): JwtPayload;
}
