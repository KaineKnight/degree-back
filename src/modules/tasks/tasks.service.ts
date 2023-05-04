import { RelatedTaskData } from './../../../dist/src/modules/tasks/types/relatedTaskData.type.d';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Brand, Category, Problem, Task } from '../../entities';
import { PageOptionsDto, PageMetaDto, PageDto } from '../../utils/pagination';

import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TasksHelperService } from './tasks-helper.service';
import { TASK_NOT_FOUND } from './constants';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly taskHelper: TasksHelperService,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
    userId: string,
    isRecommendation: boolean,
  ): Promise<PageDto<Task>> {
    const { take, skip, order } = pageOptionsDto;
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

    const data = this.taskHelper.sliceTasksPage(
      recommendedTasks,
      pageMetaDto,
      pageOptionsDto,
    );

    // 7. return data
    return new PageDto(data, pageMetaDto);
  }

  async findOne(id: string): Promise<Task> {
    const task: Task = await this.taskRepository.findOne({
      where: { id },
      relations: ['brand', 'category', 'problem'],
    });
    if (!task) throw new NotFoundException(TASK_NOT_FOUND);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task: Task = await this.taskRepository.findOne({
      where: { id },
      relations: ['brand', 'category', 'problem'],
    });
    const relatedData: RelatedTaskData = {};
    if (updateTaskDto.brandId) {
      const brand: Brand = await this.brandRepository.findOneBy({
        id: updateTaskDto.brandId,
      });
      relatedData.brand = brand;
    }
    if (updateTaskDto.categoryId) {
      const category: Category = await this.categoryRepository.findOneBy({
        id: updateTaskDto.categoryId,
      });
      relatedData.category = category;
    }
    if (updateTaskDto.problemTitle) {
      const problem: Problem = await this.problemRepository.findOneBy({
        title: updateTaskDto.problemTitle,
      });
      relatedData.problem = problem;
    }
    await this.taskRepository.update(task, {
      ...updateTaskDto,
      ...relatedData,
    });
    return task;
  }

  async remove(id: string): Promise<DeleteResult> {
    const task: Task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(TASK_NOT_FOUND);
    return await this.taskRepository.delete(task);
  }
}
