import { JwtPayload } from './options';

export interface TokenServiceInterface {
  generateAccessToken(payload: JwtPayload): string;

  generateRefreshToken(payload: JwtPayload): string;

  verifyAccessJWT(token: string): Promise<string>;
}
