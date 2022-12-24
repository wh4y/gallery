import { JwtPayload } from './types';
import { User } from '../../../user/entity/User';

export interface TokenServiceInterface {
  generateAccessToken(payload: JwtPayload): string;

  generateRefreshToken(payload: JwtPayload): string;

  verifyJWT(token: string, type: string): Promise<string>;

  generateTokensFromFromUser(user: User): string[];

  decodeToken(token: string): JwtPayload;
}
