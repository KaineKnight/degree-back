import { PartialType } from '@nestjs/mapped-types';

import { CreateProblemDto } from './create-problem.dto';
import { IsOptional } from 'class-validator';

export class UpdateProblemDto extends PartialType(CreateProblemDto) {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  time?: number;

  @IsOptional()
  price?: number;

  @IsOptional()
  commonnessWeight?: number;

  @IsOptional()
  modelTitle?: string;
}
