import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { UserResponse } from './response/UserResponse';

export interface AuthControllerInterface {
  signIn(dto: SignInDto): Promise<UserResponse>;
  singUp(dto: SignUpDto): Promise<UserResponse>;
  singOut(): Promise<void>;
  refreshToken(): Promise<void>;
}
