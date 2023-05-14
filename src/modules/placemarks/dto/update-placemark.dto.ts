import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { emptyStringToNull } from 'src/utils';

import { CreatePlacemarkDto } from './create-placemark.dto';

export class UpdatePlacemarkDto extends PartialType(CreatePlacemarkDto) {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  title?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  x?: number;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  y?: number;
}
