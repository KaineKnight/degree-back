import { Injectable } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities';
import { Like, Repository } from 'typeorm';
import { PageOptionsDto } from '../../utils/pagination/page-options.dto';
import { PageMetaDto } from '../../utils/pagination/page-meta.dto';
import { PageDto } from '../../utils/pagination/page.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  async findAll(pageOptionsDto: PageOptionsDto, searchTemplate: string) {
    const { take } = pageOptionsDto;
    const { skip } = pageOptionsDto;
    const { order } = pageOptionsDto;
    const search = searchTemplate || '';

    const [data, itemCount] = await this.taskRepository.findAndCount({
      where: { title: Like(`%${search}%`) },
      relations: ['users'],
      order: { title: order },
      take,
      skip,
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
