import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TaskUser } from './task-user.entity';
import { Problem } from './problem.entity';
import { Status } from './status.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  contactName: string;

  @Column()
  contactPhone: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ default: false })
  isCompleted: boolean;

  @OneToMany(() => TaskUser, (user) => user.task)
  users: TaskUser[];

  @ManyToOne(() => Problem, (problem) => problem.tasks)
  problem: Problem;

  @ManyToOne(() => Status, (status) => status.tasks)
  status: Status;
}
