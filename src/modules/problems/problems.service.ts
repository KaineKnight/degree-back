import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Model, Problem } from 'src/entities';
import { PageOptionsDto, PageMetaDto, PageDto } from 'src/utils/pagination';

import { RelatedProblemData } from './types';
import { CreateProblemDto, UpdateProblemDto } from './dto';
import { PROBLEM_ALREADY_EXISTS, PROBLEM_NOT_FOUND } from './constants';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<Problem> {
    const foundProblem = await this.problemRepository
      .createQueryBuilder('problem')
      .innerJoinAndSelect('problem.model', 'model')
      .where('model.title = :title', { title: createProblemDto.title })
      .getOne();
    if (foundProblem) throw new BadRequestException(PROBLEM_ALREADY_EXISTS);
    const model =
      createProblemDto.modelTitle &&
      (await this.modelRepository.findOneBy({
        title: createProblemDto.modelTitle,
      }));
    const problem: Problem = await this.problemRepository.save({
      ...createProblemDto,
      model,
    });
    return problem;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
  ): Promise<PageDto<Problem>> {
    const { order, take, skip } = pageOptionsDto;
    const [data, itemCount] = await this.problemRepository.findAndCount({
      where: { title: Like(`%${search}%`) },
      relations: ['model', 'model.category', 'model.brand'],
      order: {
        model: {
          title: order,
          category: { title: order },
          brand: { title: order },
        },
      },
      take,
      skip,
    });
    const meta = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, meta);
  }

  async findOne(id: string): Promise<Problem> {
    const problem: Problem = await this.problemRepository.findOne({
      where: { id },
      relations: ['model', 'model.category', 'model.brand'],
    });
    if (!problem) throw new NotFoundException(PROBLEM_NOT_FOUND);
    return problem;
  }

  async update(
    id: string,
    updateProblemDto: UpdateProblemDto,
  ): Promise<Problem> {
    const problem: Problem = await this.findOne(id);

    const isModelUpdating: boolean =
      updateProblemDto.modelTitle &&
      updateProblemDto.modelTitle !== problem.model.title;

    const model: Model =
      isModelUpdating &&
      (await this.modelRepository.findOneBy({
        title: updateProblemDto.modelTitle,
      }));

    const relatedData: RelatedProblemData = {};
    if (model) relatedData.model = model;

    await this.problemRepository.update(problem, {
      ...updateProblemDto,
      ...relatedData,
    });
    return problem;
  }

  async remove(id: string): Promise<DeleteResult> {
    const problem: Problem = await this.problemRepository.findOneBy({ id });
    if (!problem) throw new NotFoundException(PROBLEM_NOT_FOUND);
    return await this.problemRepository.delete(problem);
  }
}
