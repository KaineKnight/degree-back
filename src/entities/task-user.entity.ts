import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('tasks_users')
export class TaskUser {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  taskId: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ManyToOne(() => Task, (task) => task.users)
  task: Task;

  @Column()
  isRejected: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
