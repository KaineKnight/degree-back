import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { emptyStringToNull } from 'src/utils';

import { CreateModelDto } from './create-model.dto';

export class UpdateModelDto extends PartialType(CreateModelDto) {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  title?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  weight?: number;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  brandTitle?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  categoryTitle?: string;
}
