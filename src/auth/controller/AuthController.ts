import { AuthControllerInterface } from './AuthControllerInterface';
import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { AuthService } from '../service/AuthService';
import { UserResponse } from './response/UserResponse';
import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { SignInOptions, SignUpOptions } from '../service/options';

@Controller('/auth')
export class AuthController implements AuthControllerInterface {
  constructor(private readonly authService: AuthService) {}

  public async refreshToken(): Promise<void> {
    throw new NotImplementedException();
  }

  @Post('/signin')
  public async signIn(@Body() dto: SignInDto): Promise<UserResponse> {
    return await this.authService.signIn(dto as SignInOptions);
  }

  public async singOut(): Promise<void> {
    throw new NotImplementedException();
  }

  @Post('/signup')
  public async singUp(@Body() dto: SignUpDto): Promise<UserResponse> {
    return await this.authService.signUp(dto as SignUpOptions);
  }
}
