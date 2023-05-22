import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Question } from 'src/entities/question.entity';
import { ASC_ORDER } from 'src/utils/constants';

import { QUESTION_ALREADY_EXISTS, QUESTION_NOT_FOUND } from './constants';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const foundQuestion: Question = await this.questionRepository.findOneBy({
      question: createQuestionDto.question,
    });
    if (foundQuestion) throw new BadRequestException(QUESTION_ALREADY_EXISTS);
    const question: Question = await this.questionRepository.save(
      createQuestionDto,
    );
    return question;
  }

  async findAll(search: string): Promise<Question[]> {
    const questions: Question[] = await this.questionRepository.find({
      where: { question: Like(`%${search}%`) },
      order: { question: ASC_ORDER },
    });
    return questions;
  }

  async findOne(id: string): Promise<Question> {
    const question: Question = await this.questionRepository.findOneBy({ id });
    if (!question) throw new NotFoundException(QUESTION_NOT_FOUND);
    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const question: Question = await this.findOne(id);
    await this.questionRepository.update(question, updateQuestionDto);
    return question;
  }

  async remove(id: string): Promise<DeleteResult> {
    const question: Question = await this.findOne(id);
    return await this.questionRepository.delete(question);
  }
}
