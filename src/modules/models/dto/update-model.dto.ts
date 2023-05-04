import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { CreateModelDto } from './create-model.dto';

export class UpdateModelDto extends PartialType(CreateModelDto) {
  @IsOptional()
  title?: string;

  @IsOptional()
  weight?: number;

  @IsOptional()
  brandTitle?: string;

  @IsOptional()
  categoryTitle?: string;
}
