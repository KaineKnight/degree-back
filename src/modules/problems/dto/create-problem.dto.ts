import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { emptyStringToNull } from 'src/utils';

export class CreateProblemDto {
  @IsNotEmpty()
  title: string;

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

  @IsNotEmpty()
  modelTitle: string;
}
