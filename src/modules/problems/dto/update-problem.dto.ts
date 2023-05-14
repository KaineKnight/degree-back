import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { emptyStringToNull } from 'src/utils';

import { CreateProblemDto } from './create-problem.dto';

export class UpdateProblemDto extends PartialType(CreateProblemDto) {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  title?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  description?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  time?: number;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  price?: number;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  commonnessWeight?: number;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  modelTitle?: string;
}
