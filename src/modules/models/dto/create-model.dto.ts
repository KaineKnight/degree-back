import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { emptyStringToNull } from 'src/utils';

export class CreateModelDto {
  @IsNotEmpty()
  title: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  weight?: number;

  @IsNotEmpty()
  brandTitle: string;

  @IsNotEmpty()
  categoryTitle: string;
}
