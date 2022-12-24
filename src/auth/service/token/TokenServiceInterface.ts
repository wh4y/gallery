import { JwtPayload } from './types';
import { User } from '../../../user/entity/User';
import { TokenTypes } from '../../core/TokenTypes';

export interface TokenServiceInterface {
  generateAccessToken(payload: JwtPayload): string;

  generateRefreshToken(payload: JwtPayload): string;

  verifyJWT(token: string, type: TokenTypes): Promise<string>;

  generateTokensFromFromUser(user: User): string[];

  decodeToken(token: string): JwtPayload;
}
