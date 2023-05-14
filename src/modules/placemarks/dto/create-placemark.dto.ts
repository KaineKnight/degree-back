import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { emptyStringToNull } from 'src/utils';

export class CreatePlacemarkDto {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  title: string;

  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;
}
