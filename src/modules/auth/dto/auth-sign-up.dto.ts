import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSignUpnDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
