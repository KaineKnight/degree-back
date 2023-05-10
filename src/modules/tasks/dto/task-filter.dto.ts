import { IsOptional, Min } from 'class-validator';

export class TaskFilterDto {
  @Min(1)
  @IsOptional()
  readonly search?: string = '';

  @Min(1)
  @IsOptional()
  readonly brands?: string = '';

  @Min(1)
  @IsOptional()
  readonly models?: string = '';

  @Min(1)
  @IsOptional()
  readonly categories?: string = '';

  @Min(1)
  @IsOptional()
  readonly problems?: string = '';

  @Min(1)
  @IsOptional()
  readonly statuses?: string = '';

  @Min(1)
  @IsOptional()
  readonly firstNames: string = '';

  @Min(1)
  @IsOptional()
  readonly lastNames: string = '';

  @IsOptional()
  readonly hasRecommendation: boolean = false;
}
