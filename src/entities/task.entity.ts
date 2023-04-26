import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskUser } from './task-user.entity';
import { Category } from './category.entity';
import { Problem } from './problem.entity';
import { Status } from './status.entity';
import { Brand } from './brand.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

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

  @ManyToOne(() => Category, (category) => category.tasks)
  category: Category;

  @ManyToOne(() => Problem, (problem) => problem.tasks)
  problem: Problem;

  @ManyToOne(() => Status, (status) => status.tasks)
  status: Status;

  @ManyToOne(() => Brand, (brand) => brand.tasks)
  brand: Brand;
}
