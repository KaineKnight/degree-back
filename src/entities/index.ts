import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { Problem } from './problem.entity';
import { Role } from './role.entity';
import { Status } from './status.entity';
import { TaskUser } from './task-user.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

const entities = [User, Task, TaskUser, Brand, Category, Problem, Role, Status];

export { User, Task, TaskUser, Brand, Category, Problem, Role, Status };

export default entities;
