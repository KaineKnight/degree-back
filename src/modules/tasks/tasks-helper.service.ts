import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Task, User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Criterions } from 'src/utils/criterions.enum';

@Injectable()
export class TasksHelperService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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

    // 4. compute maxMinPriceDiff and maxMinTimeDiff
    let maxPrice = 0;
    let minPrice = 1;
    let minTime = 0;
    let maxTime = 1;

    tasks.forEach((task) => {
      const price = task?.problem?.price ?? 0;
      if (price > maxPrice) maxPrice = price;
      if (price < minPrice) minPrice = price;

      // time in minutes
      const time = task?.problem?.time ?? 0;
      const timeReplacement = -time;
      if (timeReplacement > maxTime) maxTime = timeReplacement;
      if (timeReplacement < minTime) minTime = timeReplacement;
    });

    const maxMinPriceDiff = maxPrice - minPrice;
    const maxMinTimeDiff = maxTime - minTime;

    // 5. compute supercriterion for every task
    tasks.forEach((task: any) => {
      // 5.1 get criterion weights
      const brand = task?.brand?.weight ?? 1;
      const category = task?.category?.weight ?? 1;
      const problem = task?.problem?.commonnessWeight ?? 1;
      const price = task?.problem?.price ?? 0;
      const time = task?.problem?.time ?? 0;
      const isConnected = user.tasks.some(
        (userTask) => userTask?.user?.id === user?.id,
      );

      // 5.2  normalize weights if needed
      const normalPrice = !price ? 1 : (price - minPrice) / maxMinPriceDiff;
      const normalTime = !time ? 1 : (-time - minTime) / maxMinTimeDiff;

      // 5.3 product weights and priorities
      const priceWeight = normalPrice * priorities[Criterions.price];
      const categoryWeight = category * priorities[Criterions.category];
      const brandWeight = brand * priorities[Criterions.brand];
      const commonnessWeight = problem * priorities[Criterions.commonness];
      const timeWeight = normalTime * priorities[Criterions.time];

      // 5.4 summarize supercriterion of task
      task.supercriterion =
        priceWeight +
        categoryWeight +
        brandWeight +
        commonnessWeight +
        timeWeight +
        -isConnected;
    });
    tasks.sort((first: any, second: any) =>
      first.supercriterion.localCompare(second.supercriterion),
    );

    // criterions:
    // *price -> max // category -> max // brand -> max // commonness -> max
    // *time -> min = -time -> max // isConnected -> min = -isConnected -> max

    return tasks;
  }
}
