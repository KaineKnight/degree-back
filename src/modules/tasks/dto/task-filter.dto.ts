import { IsOptional } from 'class-validator';

export class TaskFilterDto {
  @IsOptional()
  readonly brands?: string;

  @IsOptional()
  readonly models?: string;

  @IsOptional()
  readonly categories?: string;

  @IsOptional()
  readonly problems?: string;
}
