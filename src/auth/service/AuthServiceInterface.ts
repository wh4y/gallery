import { SignInOptions, SignUpOptions } from './options';
import { User } from '../../user/entity/User';

export interface AuthServiceInterface {
  signIn(options: SignInOptions): Promise<User>;

  signUp(options: SignUpOptions): Promise<User>;
}
