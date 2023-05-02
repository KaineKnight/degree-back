import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Problem } from 'src/entities';
import { PageOptionsDto } from 'src/utils/pagination/page-options.dto';
import { PageMetaDto } from 'src/utils/pagination/page-meta.dto';
import { PageDto } from 'src/utils/pagination/page.dto';

import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { PROBLEM_ALREADY_EXISTS, PROBLEM_NOT_FOUND } from './constants';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<Problem> {
    const foundProblem: Problem = await this.problemRepository.findOneBy({
      title: createProblemDto.title,
    });
    if (foundProblem) throw new BadRequestException(PROBLEM_ALREADY_EXISTS);
    const problem: Problem = await this.problemRepository.save(
      createProblemDto,
    );
    return problem;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
  ): Promise<PageDto<Problem>> {
    const { order, take, skip } = pageOptionsDto;
    const [data, itemCount] = await this.problemRepository.findAndCount({
      where: { title: Like(`%${search}%`) },
      order: { title: order },
      take,
      skip,
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async findOne(id: string): Promise<Problem> {
    const problem: Problem = await this.problemRepository.findOneBy({ id });
    if (!problem) throw new NotFoundException(PROBLEM_NOT_FOUND);
    return problem;
  }

  async update(
    id: string,
    updateProblemDto: UpdateProblemDto,
  ): Promise<Problem> {
    const problem: Problem = await this.problemRepository.findOneBy({ id });
    if (!problem) throw new NotFoundException(PROBLEM_NOT_FOUND);
    await this.problemRepository.update(problem, updateProblemDto);
    return problem;
  }

  async remove(id: string): Promise<DeleteResult> {
    const problem: Problem = await this.problemRepository.findOneBy({ id });
    if (!problem) throw new NotFoundException(PROBLEM_NOT_FOUND);
    return await this.problemRepository.delete(problem);
  }
}
