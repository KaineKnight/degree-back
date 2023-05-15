import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Problem, Status, Task, TaskUser, User } from '../../entities';
import { PageOptionsDto, PageMetaDto, PageDto } from '../../utils/pagination';
import { PROBLEM_NOT_FOUND } from '../problems/constants';

import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from './dto';
import { TasksHelperService } from './tasks-helper.service';
import { TASK_NOT_FOUND, relations } from './constants';
import { RelatedTaskData } from './types';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly taskHelper: TasksHelperService,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(TaskUser)
    private readonly taskUserRepository: Repository<TaskUser>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const problem: Problem = await this.problemRepository
      .createQueryBuilder('problem')
      .innerJoin('problem.model', 'model')
      .where('model.id = :id', { id: createTaskDto.modelId })
      .andWhere('problem.id = :modelId', { modelId: createTaskDto.problemId })
      .getOne();
    if (!problem) throw new BadRequestException(PROBLEM_NOT_FOUND);
    const task: Task = await this.taskRepository.save({
      ...createTaskDto,
      problem,
    });
    return task;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    taskFilterDto: TaskFilterDto,
    userId: string,
  ): Promise<PageDto<Task>> {
    //console.log(pageOptionsDto);
    //console.log(taskFilterDto);

    const { take, skip, order } = pageOptionsDto;
    //console.log({ take, skip, order });
    //console.log(pageOptionsDto.skip);

    const {
      search,
      brands,
      models,
      categories,
      problems,
      statuses,
      firstNames,
      lastNames,
      hasRecommendation,
    } = taskFilterDto;

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'taskUser')
      .leftJoinAndSelect('taskUser.user', 'user')
      .leftJoinAndSelect('task.status', 'status')
      .leftJoinAndSelect('task.problem', 'problem')
      .leftJoinAndSelect('problem.model', 'model')
      .leftJoinAndSelect('model.brand', 'brand')
      .leftJoinAndSelect('model.category', 'category');

    if (search)
      queryBuilder.where('problem.title ILIKE :search', {
        search: `%${search}%`,
      });
    if (models)
      queryBuilder.andWhere('model.title IN (:models)', {
        models: models.split(' '),
      });
    if (brands)
      queryBuilder.andWhere('brand.title IN (:brands)', {
        brands: brands.split(' '),
      });
    if (categories)
      queryBuilder.andWhere('category.title IN (:categories)', {
        categories: categories.split(' '),
      });
    if (problems)
      queryBuilder.andWhere('problem.title IN (:problems)', {
        problems: problems.split(' '),
      });
    if (statuses)
      queryBuilder.andWhere('status.title IN (:statuses)', {
        statuses: statuses.split(' '),
      });
    if (firstNames)
      queryBuilder.andWhere('user.firstName IN (:firstNames)', {
        firstNames: firstNames.split(' '),
      });
    if (lastNames)
      queryBuilder.andWhere('user.lastName IN (:lastNames)', {
        lastNames: lastNames.split(' '),
      });
    console.log(!!userId);
    console.log(!!hasRecommendation);

    if (!userId || !hasRecommendation) {
      const [data, itemCount] = await queryBuilder
        .orderBy('task.createdAt', order)
        .skip(skip)
        .take(take)
        .getManyAndCount();
      console.log('no rec');
      const meta = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(data, meta);
    }

    // multi-criteria linear convolution algorithm
    console.log('yes rec');

    // 2. get all tasks
    queryBuilder.andWhere('task.isCompleted = :isCompleted', {
      isCompleted: false,
    });
    const [tasks, itemCount] = await queryBuilder.getManyAndCount();

    const recommendedTasks = await this.taskHelper.recommendTasks(
      tasks,
      userId,
    );

    // 6. slice elements according to pagination
    const meta = new PageMetaDto({ itemCount, pageOptionsDto });
    const data = this.taskHelper.sliceTasksPage(
      recommendedTasks,
      meta,
      pageOptionsDto,
    );

    // 7. return data
    return new PageDto(data, meta);
  }

  async findOne(id: string): Promise<Task> {
    const task: Task = await this.taskRepository.findOne({
      where: { id },
      relations,
    });
    if (!task) throw new NotFoundException(TASK_NOT_FOUND);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task: Task = await this.findOne(id);

    const isProblemTitleUpdating: boolean =
      updateTaskDto.problemTitle &&
      updateTaskDto.problemTitle !== task.problem.title;
    const isModelUpdating: boolean =
      updateTaskDto.modelId && updateTaskDto.modelId !== task.problem.model.id;

    const isProblemUpdating: boolean =
      isProblemTitleUpdating || isModelUpdating;
    const problem =
      isProblemUpdating &&
      (await this.problemRepository
        .createQueryBuilder('problem')
        .innerJoinAndSelect('problem.model', 'model')
        .where('model.id = :id', { id: updateTaskDto.modelId })
        .andWhere('problem.title = : title', {
          title: updateTaskDto.problemTitle,
        })
        .getOne());

    const isStatusUpdating: boolean =
      updateTaskDto.statusId && updateTaskDto.statusId !== task.status.id;
    const status: Status =
      isStatusUpdating &&
      (await this.statusRepository.findOneBy({
        id: updateTaskDto.statusId,
      }));

    const relatedData: RelatedTaskData = {};
    if (problem) relatedData.problem = problem;
    if (status) relatedData.status = status;

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

  async acceptTaskByUser(userId: string, taskId: string): Promise<User> {
    const [user, userTask] = await this.taskHelper.getUserAndTaskUser(
      userId,
      taskId,
    );
    if (userTask) await this.taskUserRepository.delete({ userId, taskId });
    else await this.taskUserRepository.save({ userId, taskId });

    return user;
  }

  async rejectTaskByUser(
    userId: string,
    taskId: string,
    isRejected: boolean,
  ): Promise<User> {
    const [user, userTask] = await this.taskHelper.getUserAndTaskUser(
      userId,
      taskId,
    );
    await this.taskUserRepository.save({
      ...userTask,
      isRejected: isRejected,
    });
    return user;
  }
}
