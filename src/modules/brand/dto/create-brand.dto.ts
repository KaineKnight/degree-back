import { IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  weight: number;
}
