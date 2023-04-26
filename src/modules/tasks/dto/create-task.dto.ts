import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { Brand, Category, Status } from 'src/entities';

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
  categoryId: string;

  @IsNotEmpty()
  brandId: string;

  @IsNotEmpty()
  problemId: string;
}
