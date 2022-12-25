import { SignInDto } from './SignInDto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto extends SignInDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  public readonly name: string;
}
