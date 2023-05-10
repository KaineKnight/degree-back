import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CreateStatusDto } from './create-status.dto';

export class UpdateStatusDto extends PartialType(CreateStatusDto) {
  @IsOptional()
  title?: string;
}
