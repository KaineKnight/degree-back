import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

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
  modelId?: string;

  @IsOptional()
  problemTitle?: string;

  @IsOptional()
  statusId?: string;
}
