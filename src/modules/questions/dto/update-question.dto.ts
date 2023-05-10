import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @IsOptional()
  question: string;

  @IsOptional()
  answer: string;
}
