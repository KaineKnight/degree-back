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

  @Column({ default: 'f0986a2e-2cb0-4b31-b43f-10ddd6248d65' })
  statusId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
