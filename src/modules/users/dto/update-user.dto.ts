import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { emptyStringToNull } from 'src/utils';

export class UpdateUserDto {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  email?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  password?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  firstName?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  lastName?: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  priorities: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  profileImage: any;
}
