import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { User } from '../../user/entity/User';

export interface AuthControllerInterface {
  signIn(dto: SignInDto): Promise<User>;
  singUp(dto: SignUpDto): Promise<User>;
  singOut(): Promise<void>;
  refreshToken(): Promise<void>;
}
