import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @Expose()
  @IsOptional()
  @IsString()
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  contactName?: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber()
  contactPhone?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  brandId?: string;

  @IsOptional()
  problemTitle?: string;
}
