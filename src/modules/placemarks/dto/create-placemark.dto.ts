import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePlacemarkDto {
  @IsOptional()
  title: string;

  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;
}
