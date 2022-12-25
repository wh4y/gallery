import { UserJwtPayload } from './types';
import { User } from '../../../user/entity/User';
import { TokenTypes } from '../../core/TokenTypes';

export interface TokenServiceInterface {
  generateAccessToken(payload: UserJwtPayload): string;

  generateRefreshToken(payload: UserJwtPayload): string;

  verifyJWT(token: string, type: TokenTypes): Promise<string>;

  generateTokensFromFromUser(user: User): string[];

  decodeToken(token: string): UserJwtPayload;
}
