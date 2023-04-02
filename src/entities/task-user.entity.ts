import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('tasks_users')
export class TaskUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ManyToOne(() => Task, (task) => task.users)
  task: Task;

  @Column()
  superCriterion: number;

  @Column()
  isRejected: boolean;
}
