import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { Response } from 'express';
import { JwtPayload } from '../service/token/types';

export interface AuthControllerInterface {
  signIn(dto: SignInDto, res: Response): Promise<void>;
  singUp(dto: SignUpDto, res: Response): Promise<void>;
  singOut(): Promise<void>;
  refreshToken(res: Response, payload: JwtPayload): Promise<void>;
}
