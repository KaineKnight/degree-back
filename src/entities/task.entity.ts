import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @OneToMany(() => TaskUser, (user) => user.task, { cascade: true })
  users: TaskUser[];

  @ManyToOne(() => Problem, (problem) => problem.tasks, { eager: true })
  problem: Problem;

  @ManyToOne(() => Status)
  @JoinColumn({
    name: 'statusId',
    referencedColumnName: 'id',
  })
  status: Status;

  @Column({
    default: '6e01a6d8-ef19-11ed-a05b-0242ac120003',
  })
  statusId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
