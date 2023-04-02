import { Criterion } from './criterion.entity';
import { TaskUser } from './task-user.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

const entities = [
  User,
  Task,
  Criterion,
  TaskUser,
];

export {
  User,
  Task,
  Criterion,
  TaskUser,
}

export default entities;
