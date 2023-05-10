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
      maxCommonness: 0,
      minCommonness: 1,
    };

    tasks.forEach((task) => {
      const price = task?.problem?.price ?? 0;
      const time = -task?.problem?.time ?? 0; // negative time
      const brand = task?.brand?.weight ?? 0;
      const category = task?.category?.weight ?? 0;
      const commonness = task?.problem?.commonnessWeight ?? 0;

      if (price > minMax.maxPrice) minMax.maxPrice = price;
      if (price < minMax.minPrice) minMax.minPrice = price;

      // time in hours
      if (time > minMax.maxTime) minMax.maxTime = time;
      if (time < minMax.minTime) minMax.minTime = time;

      if (brand > minMax.maxBrand) minMax.maxBrand = brand;
      if (brand < minMax.minBrand) minMax.minBrand = brand;

      if (category > minMax.maxCategory) minMax.maxCategory = category;
      if (category < minMax.minCategory) minMax.minCategory = category;

      if (commonness > minMax.maxCommonness) minMax.maxCommonness = commonness;
      if (commonness < minMax.minCommonness) minMax.minCommonness = commonness;
    });
    return minMax;
  }

  computeMaxMinDiff(minMax: MinMax): MaxMinDiff {
    const maxMinDiff: MaxMinDiff = {
      price: minMax.maxPrice - minMax.minPrice,
      time: minMax.maxTime - minMax.minTime,
      brand: minMax.maxBrand - minMax.minBrand,
      category: minMax.maxCategory - minMax.minCategory,
      commonness: minMax.maxCommonness - minMax.minCommonness,
    };
    return maxMinDiff;
  }

  getCriterionWeighs(task, user): CriterionsWeighs {
    const criterions: CriterionsWeighs = {
      brand: task?.brand?.weight ?? 1,
      category: task?.category?.weight ?? 1,
      problem: task?.problem?.commonnessWeight ?? 1,
      price: task?.problem?.price ?? 0,
      time: task?.problem?.time ?? 0,
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
    const { price, time, brand, category, problem, isConnected } = criterions;
    const normalized: NormalizedWeighs = {
      price: !price ? 1 : (price - minMax.minPrice) / maxMinDiff.price,
      time: !time ? 1 : (-time - minMax.minTime) / maxMinDiff.time,
      brand: (brand - minMax.minBrand) / maxMinDiff.brand,
      category: (category - minMax.minCategory) / maxMinDiff.category,
      commonness: (problem - minMax.minCommonness) / maxMinDiff.commonness,
      isConnected,
    };
    return normalized;
  }

  computeWeighs(normalized: NormalizedWeighs, priorities): Weighs {
    const { price, category, brand, commonness, time, isConnected } =
      normalized;
    const weighs: Weighs = {
      price: price * priorities[Criterions.price],
      category: category * priorities[Criterions.category],
      brand: brand * priorities[Criterions.brand],
      commonness: commonness * priorities[Criterions.commonness],
      time: time * priorities[Criterions.time],
      isConnected,
    };
    return weighs;
  }

  computeSupercriterion(tasks, minMax, maxMinDiff, user, priorities) {
    return tasks.forEach((task: any) => {
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
      task.supercriterion =
        weighs.price +
        weighs.category +
        weighs.brand +
        weighs.commonness +
        weighs.time +
        -weighs.isConnected;
    });
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

    tasksCriterions.sort((first: any, second: any) =>
      first.supercriterion.localCompare(second.supercriterion),
    );

    // criterions:
    // *price -> max // category -> max // brand -> max // commonness -> max
    // *time -> min = -time -> max // isConnected -> min = -isConnected -> max

    return tasks;
  }

  sliceTasksPage(
    tasks: any,
    meta: PageMetaDto,
    pageOptionsDto: PageOptionsDto,
  ) {
    const pageStartProduct = (meta.page - 1) * meta.take;
    const pageStart = pageStartProduct > 0 ? pageStartProduct : 0;
    const pageEnd = pageStart + pageOptionsDto.take;
    const data = tasks.slice(pageStart, pageEnd);
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
