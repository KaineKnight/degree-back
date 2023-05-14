import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { emptyStringToNull } from 'src/utils';

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

  @Transform((params) => emptyStringToNull(params))
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  @IsEmail()
  contactEmail: string;

  @IsNotEmpty()
  modelId: string;

  @IsNotEmpty()
  problemId: string;
}
