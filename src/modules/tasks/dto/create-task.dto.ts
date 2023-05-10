import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  contactName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  contactPhone: string;

  @IsOptional()
  @IsEmail()
  contactEmail: string;

  @IsNotEmpty()
  modelId: string;

  @IsNotEmpty()
  problemTitle: string;
}
