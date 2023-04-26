import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Task, User } from '../../entities';
import { PageOptionsDto } from '../../utils/pagination/page-options.dto';
import { PageMetaDto } from '../../utils/pagination/page-meta.dto';
import { PageDto } from '../../utils/pagination/page.dto';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksHelperService } from './tasks-helper.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly taskHelper: TasksHelperService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    return createTaskDto;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    searchTemplate: string,
    userId: string,
    isRecommendation: boolean,
  ) {
    const { take } = pageOptionsDto;
    const { skip } = pageOptionsDto;
    const { order } = pageOptionsDto;
    const search = searchTemplate || '';
    // regular request to database
    if (!userId && !isRecommendation) {
      const [data, itemCount] = await this.taskRepository.findAndCount({
        where: { title: Like(`%${search}%`) },
        // relations: ['users'], // why???
        order: { title: order },
        take,
        skip,
      });
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(data, pageMetaDto);
    }

    // multi-criteria linear convolution algorithm

    // 2. get all tasks
    const tasks = await this.taskRepository.find({
      where: { title: Like(`%${search}%`), isCompleted: false },
      relations: ['brand', 'category', 'problem'],
    });

    const recommendedTasks = await this.taskHelper.recommendTasks(
      tasks,
      userId,
    );
    // 6. slice elements according to pagination
    const itemCount = recommendedTasks.length;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    const pageStartProduct = (pageMetaDto.page - 1) * pageMetaDto.take;
    const pageStart = pageStartProduct > 0 ? pageStartProduct : 0;
    const pageEnd = pageStart + pageOptionsDto.take;
    const data = recommendedTasks.slice(pageStart, pageEnd);

    // 7. return data
    return new PageDto(data, pageMetaDto);
  }

  findOne(id: string) {
    return `This action returns a #${id} task`;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: string) {
    return `This action removes a #${id} task`;
  }
}
