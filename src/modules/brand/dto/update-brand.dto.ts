import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsOptional()
  title?: string;

  @IsOptional()
  weight?: number;
}
