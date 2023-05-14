import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { emptyStringToNull } from 'src/utils';

import { CreateStatusDto } from './create-status.dto';

export class UpdateStatusDto extends PartialType(CreateStatusDto) {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  title?: string;
}
