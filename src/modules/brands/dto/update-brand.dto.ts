import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { emptyStringToNull } from 'src/utils';

import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  title?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  weight?: number;
}
