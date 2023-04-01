import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  getAllTasks() {
    return [1, 2, 3];
  }
}
