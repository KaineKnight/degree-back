import { PartialType } from '@nestjs/swagger';

import { CreatePlacemarkDto } from './create-placemark.dto';
import { IsOptional } from 'class-validator';

export class UpdatePlacemarkDto extends PartialType(CreatePlacemarkDto) {
  @IsOptional()
  title?: string;

  @IsOptional()
  x?: number;

  @IsOptional()
  y?: number;
}
