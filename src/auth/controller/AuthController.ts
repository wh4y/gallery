import { AuthControllerInterface } from './AuthControllerInterface';
import {
  Body,
  Controller,
  NotImplementedException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../service/auth/AuthService';
import { SignInDto } from './dto/SignInDto';
import { SignUpDto } from './dto/SignUpDto';
import { SignInOptions, SignUpOptions } from '../service/auth/types';
import { AttachJwtInterceptor } from './interceptor/AttachTokensInterceptor';
import { User } from '../../user/entity/User';

@Controller('/auth')
export class AuthController implements AuthControllerInterface {
  constructor(private readonly authService: AuthService) {}

  public async refreshToken(): Promise<void> {
    throw new NotImplementedException();
  }

  @UseInterceptors(AttachJwtInterceptor)
  @Post('/signin')
  public async signIn(@Body() dto: SignInDto): Promise<User> {
    return await this.authService.signIn(dto as SignInOptions);
  }

  public async singOut(): Promise<void> {
    throw new NotImplementedException();
  }

  @UseInterceptors(AttachJwtInterceptor)
  @Post('/signup')
  public async singUp(@Body() dto: SignUpDto): Promise<User> {
    return await this.authService.signUp(dto as SignUpOptions);
  }
}
