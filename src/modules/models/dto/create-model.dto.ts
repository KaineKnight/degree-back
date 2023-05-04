import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateModelDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  weight?: number;

  @IsNotEmpty()
  brandTitle: string;

  @IsNotEmpty()
  categoryTitle: string;
}
