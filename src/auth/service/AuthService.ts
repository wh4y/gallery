import { AuthServiceInterface } from './AuthServiceInterface';
import { Injectable } from '@nestjs/common';
import { SignInOptions, SignUpOptions } from './options';
import { User } from '../../user/entity/User';
import { UserService } from '../../user/service/UserService';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(private readonly userService: UserService) {}

  public async signIn({ email, password }: SignInOptions): Promise<User> {
    const user = await this.userService.findUserByEmail(email, true);
    if (!user) throw Error('Incorrect password or email!');

    const isPassportValid = await this.comparePasswords(
      password,
      user.password,
    );
    if (!isPassportValid) throw Error('Incorrect password or email!');

    return user;
  }

  public async signUp({ email, password, name }: SignUpOptions): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (user) throw Error('User already exists!');

    const hashedPassword = await this.hashPassword(password);
    await this.userService.addNewUser({
      email,
      password: hashedPassword,
      name,
    });

    return (await this.userService.findUserByEmail(email, true)) as User;
  }

  private async comparePasswords(
    passwordToCompare: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passwordToCompare, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, await bcrypt.genSalt());
  }
}
