import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { emptyStringToNull } from 'src/utils';

import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  title?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  weight?: number;
}
