import { Transform } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

import { emptyStringToNull } from 'src/utils';

export class TaskFilterDto {
  @Min(1)
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly search?: string = '';

  @Min(1)
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly brands?: string = '';

  @Min(1)
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly models?: string = '';

  @Min(1)
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly categories?: string = '';

  @Min(1)
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly problems?: string = '';

  @Min(1)
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly statuses?: string = '';

  @Min(1)
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly firstNames: string = '';

  @Min(1)
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly lastNames: string = '';

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  readonly hasRecommendation: boolean = false;
}
