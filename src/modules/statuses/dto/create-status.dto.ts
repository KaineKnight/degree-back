import { IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @IsNotEmpty()
  title: string;
}
