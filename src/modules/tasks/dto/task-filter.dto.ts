import { Transform } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

import { emptyStringToNull } from 'src/utils';

export class TaskFilterDto {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly search?: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly brands?: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly models?: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly categories?: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly problems?: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly statuses?: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly firstNames: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly lastNames: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly hasRecommendation: boolean = false;
}
