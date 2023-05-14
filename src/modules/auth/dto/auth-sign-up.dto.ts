/* eslint prettier/prettier: 0 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSignUpnDto {
  @ApiProperty({ example: 'John', description: 'User Name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'John', description: 'User Name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'em@il.com', description: 'User Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({example: 'LA3asdfW123a3j', description: 'User hashed password'})
  @IsNotEmpty()
  password: string;
}
