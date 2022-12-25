import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { Request, Response } from 'express';

export interface AuthControllerInterface {
  signIn(dto: SignInDto, res: Response): Promise<void>;
  singUp(dto: SignUpDto, res: Response): Promise<void>;
  singOut(res: Response): Promise<void>;
  refreshToken(res: Response, req: Request): Promise<void>;
}
