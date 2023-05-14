import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

import { emptyStringToNull } from 'src/utils';

import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @Expose()
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  @IsString()
  title?: string;

  @Expose()
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  @IsString()
  contactName?: string;

  @Expose()
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  @IsPhoneNumber()
  contactPhone?: string;

  @Expose()
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  modelId?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  problemTitle?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  statusId?: string;
}
