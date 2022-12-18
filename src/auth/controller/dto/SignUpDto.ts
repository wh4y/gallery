import { SignInDto } from './SignInDto';

export class SignUpDto extends SignInDto {
  public readonly name: string;
}
