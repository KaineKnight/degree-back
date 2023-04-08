import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('tasks_users')
export class TaskUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ManyToOne(() => Task, (task) => task.users)
  task: Task;

  @Column()
  isRejected: boolean;
}
