import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task, TaskUser, User } from 'src/entities';
import { Criterions } from 'src/utils/criterions.enum';
import { PageMetaDto, PageOptionsDto } from 'src/utils/pagination';
import { USER_NOT_FOUND } from 'src/utils/constants';

import {
  MinMax,
  MaxMinDiff,
  NormalizedWeighs,
  CriterionsWeighs,
  Weighs,
} from './types';
import { TASK_NOT_FOUND } from './constants';

@Injectable()
export class TasksHelperService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TaskUser)
    private readonly taskUserRepository: Repository<TaskUser>,
  ) {}

  computeMinMax(tasks): MinMax {
    const minMax: MinMax = {
      maxPrice: 0,
      minPrice: 1,
      maxTime: 1, // negative time
      minTime: 0,
      maxBrand: 0,
      minBrand: 1,
      maxCategory: 0,
      minCategory: 1,
      maxModel: 0,
      minModel: 1,
      maxCommonness: 0,
      minCommonness: 1,
    };

    tasks.forEach((task) => {
      const price = task.problem.price ?? 0;
      const time = task.problem.time ?? 0; // negative time
      const brand = task.problem.model.brand.weight ?? 0;
      const category = task.problem.model.category.weight ?? 0;
      const model = task.problem.model.weight ?? 0;
      const commonness = task.problem.commonnessWeight ?? 0;

      if (price > minMax.maxPrice) minMax.maxPrice = +price;
      if (price < minMax.minPrice) minMax.minPrice = +price;

      // time in hours
      if (time < minMax.maxTime) minMax.maxTime = +time;
      if (time > minMax.minTime) minMax.minTime = +time;

      if (brand > minMax.maxBrand) minMax.maxBrand = +brand;
      if (brand < minMax.minBrand) minMax.minBrand = +brand;

      if (category > minMax.maxCategory) minMax.maxCategory = +category;
      if (category < minMax.minCategory) minMax.minCategory = +category;

      if (model > minMax.maxModel) minMax.maxModel = +model;
      if (model < minMax.minModel) minMax.minModel = +model;

      if (commonness > minMax.maxCommonness) minMax.maxCommonness = +commonness;
      if (commonness < minMax.minCommonness) minMax.minCommonness = +commonness;
    });
    return minMax;
  }

  computeMaxMinDiff(minMax: MinMax): MaxMinDiff {
    const maxMinDiff: MaxMinDiff = {
      price: minMax.maxPrice - minMax.minPrice,
      time: -minMax.maxTime - -minMax.minTime,
      brand: minMax.maxBrand - minMax.minBrand,
      category: minMax.maxCategory - minMax.minCategory,
      model: minMax.maxModel - minMax.minModel,
      commonness: minMax.maxCommonness - minMax.minCommonness,
    };
    return maxMinDiff;
  }

  getCriterionWeighs(task, user): CriterionsWeighs {
    const criterions: CriterionsWeighs = {
      brand: task.problem.model.brand.weight,
      category: task.problem.model.category.weight,
      model: task.problem.model.weight,
      problem: task.problem.commonnessWeight,
      price: +task.problem.price,
      time: +task.problem.time,
      isConnected: user.tasks.some(
        (userTask) => userTask?.user?.id === user?.id,
      ),
    };
    return criterions;
  }

  normalizeWeighs(
    minMax: MinMax,
    maxMinDiff: MaxMinDiff,
    criterions: CriterionsWeighs,
  ): NormalizedWeighs {
    const { price, time, brand, category, model, problem, isConnected } =
      criterions;

    const normalized: NormalizedWeighs = {
      price: (price - minMax.minPrice) / maxMinDiff.price,
      time: (minMax.minTime - time) / maxMinDiff.time,
      brand: (brand - minMax.minBrand) / maxMinDiff.brand,
      category: (category - minMax.minCategory) / maxMinDiff.category,
      model: (model - minMax.minModel) / maxMinDiff.model,
      commonness: (problem - minMax.minCommonness) / maxMinDiff.commonness,
      isConnected,
    };
    return normalized;
  }

  computeWeighs(normalized: NormalizedWeighs, priorities): Weighs {
    const { price, category, brand, model, commonness, time, isConnected } =
      normalized;
    const weighs: Weighs = {
      price: price * priorities[Criterions.price],
      category: category * priorities[Criterions.category],
      brand: brand * priorities[Criterions.brand],
      model: model * priorities[Criterions.model],
      commonness: commonness * priorities[Criterions.commonness],
      time: time * priorities[Criterions.time],
      isConnected,
    };
    return weighs;
  }

  computeSupercriterion(tasks, minMax, maxMinDiff, user, priorities) {
    const tasksCriterions: Array<any> = [];
    tasks.forEach((task: any) => {
      // 5.1 get criterion weights
      const criterions: CriterionsWeighs = this.getCriterionWeighs(task, user);

      // 5.2  normalize weights if needed
      const normalized: NormalizedWeighs = this.normalizeWeighs(
        minMax,
        maxMinDiff,
        criterions,
      );

      // 5.3 product weights and priorities
      const weighs = this.computeWeighs(normalized, priorities);

      // 5.4 summarize supercriterion of task
      const supercriterion =
        weighs.price +
        weighs.category +
        weighs.brand +
        weighs.commonness +
        weighs.time +
        -weighs.isConnected;
      tasksCriterions.push({ ...task, supercriterion });
    });

    return tasksCriterions;
  }

  async recommendTasks(tasks, userId): Promise<Array<any>> {
    // 1. get user by id
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tasks'],
    });

    // 3. get priorities of user
    const prioritiesString = user.priorities;
    const priorities = prioritiesString
      .split(' ')
      .map((item) => parseInt(item));

    // 4. compute maxMinDiff
    const minMax: MinMax = this.computeMinMax(tasks);
    const maxMinDiff: MaxMinDiff = this.computeMaxMinDiff(minMax);

    // 5. compute supercriterion for every task
    const tasksCriterions = this.computeSupercriterion(
      tasks,
      minMax,
      maxMinDiff,
      user,
      priorities,
    );
    // log('-------------------');
    // tasksCriterions.forEach((t) => log(t.supercriterion));
    tasksCriterions.sort((a, b) => b.supercriterion - a.supercriterion);
    console.log('+++++++++++++++++++');
    tasksCriterions.forEach((t) => console.log(t.supercriterion));

    // criterions:
    // *price -> max // category -> max // brand -> max // commonness -> max
    // *time -> min = -time -> max // isConnected -> min = -isConnected -> max

    return tasksCriterions;
  }

  sliceTasksPage(tasks: any, take, page) {
    const start = (page - 1) * take;
    const end = start + take;
    const data = tasks.slice(start, end);
    console.log('dataLen', data.length);
    return data;
  }

  async getUserAndTaskUser(
    userId: string,
    taskId: string,
  ): Promise<[User, TaskUser]> {
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tasks', 'tasks.task'],
    });
    if (!user) throw new NotFoundException(USER_NOT_FOUND);
    const task: Task = await this.taskRepository.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException(TASK_NOT_FOUND);
    if (!task.isCompleted) throw new BadRequestException('Task already in use');
    const userTask: TaskUser = await this.taskUserRepository.findOneBy({
      taskId,
      userId,
    });
    return [user, userTask];
  }
}
