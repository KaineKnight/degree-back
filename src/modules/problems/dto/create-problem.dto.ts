import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProblemDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  time?: number;

  @IsOptional()
  price?: number;

  @IsOptional()
  commonnessWeight?: number;

  @IsNotEmpty()
  modelTitle: string;
}
