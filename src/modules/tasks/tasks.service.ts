import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Brand, Category, Problem, Task } from '../../entities';
import { PageOptionsDto, PageMetaDto, PageDto } from '../../utils/pagination';

import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TasksHelperService } from './tasks-helper.service';
import { TASK_NOT_FOUND } from './constants';
import { RelatedTaskData } from './types';

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
    return await this.taskRepository.findOneBy({ id: '1' });
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
    userId: string,
    isRecommendation: boolean,
    modelFilter: string,
    brandFilter: string,
    categoryFilter: string,
    problemFilter: string,
    statusFilter: string,
    firstNameFilter: string,
    lastNameFilter: string,
  ): Promise<PageDto<Task>> {
    const { take, skip, order } = pageOptionsDto;

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'taskUser')
      .leftJoinAndSelect('taskUser.user', 'user')
      .leftJoinAndSelect('task.status', 'status')
      .leftJoinAndSelect('task.problem', 'problem')
      .leftJoinAndSelect('problem.model', 'model')
      .leftJoinAndSelect('model.brand', 'brand')
      .leftJoinAndSelect('model.category', 'category');

    if (modelFilter)
      queryBuilder.where('model.title IN (:models)', { models: [] });
    if (brandFilter)
      queryBuilder.andWhere('brand.title IN (:brands)', { brands: [] });
    if (categoryFilter)
      queryBuilder.andWhere('category.title IN (:categories)', {
        categories: [],
      });
    if (problemFilter)
      queryBuilder.andWhere('problem.title IN (:problems)', { problems: [] });
    if (statusFilter)
      queryBuilder.andWhere('status.title IN (:statuses)', { statuses: [] });
    if (firstNameFilter)
      queryBuilder.andWhere('user.firstName IN (:firstNames)', {
        firstNames: [],
      });
    if (lastNameFilter)
      queryBuilder.andWhere('user.lastName IN (:lastNames)', {
        lastNames: [],
      });

    const [tasks, itemCount] = await queryBuilder.getManyAndCount();









    // const relationsArray = [
    //   'users', // userTask to check whether task is occupied
    //   'status',
    //   'problem',
    //   'problem.model',
    //   'problem.model.brand',
    //   'problem.model.category',
    // ];
    // // regular request to database
    // if (!userId && !isRecommendation) {
    //   const [data, itemCount] = await this.taskRepository.findAndCount({
    //     where: { title: Like(`%${search}%`) },
    //     relations: relationsArray,
    //     order: { title: order },
    //     take,
    //     skip,
    //   });
    //   const meta = new PageMetaDto({ itemCount, pageOptionsDto });
    //   return new PageDto(data, meta);
    // }

    // // multi-criteria linear convolution algorithm

    // // 2. get all tasks
    // const [tasks, itemCount] = await this.taskRepository.findAndCount({
    //   where: { title: Like(`%${search}%`), isCompleted: false },
    //   relations: relationsArray,
    // });

    // const recommendedTasks = await this.taskHelper.recommendTasks(
    //   tasks,
    //   userId,
    // );
    // // 6. slice elements according to pagination
    // const meta = new PageMetaDto({ itemCount, pageOptionsDto });

    // const data = this.taskHelper.sliceTasksPage(
    //   recommendedTasks,
    //   meta,
    //   pageOptionsDto,
    // );

    // // 7. return data
    // return new PageDto(data, meta);
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
