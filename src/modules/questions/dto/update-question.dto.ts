import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { emptyStringToNull } from 'src/utils';

import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  question: string;

  @Transform((params) => emptyStringToNull(params))
  @IsOptional()
  answer: string;
}
