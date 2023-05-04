import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from './task.entity';
import { Model } from './model.entity';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true }) // hours to complete
  time: number;

  @Column({ nullable: true })
  price: number;

  @Column({ default: 0 })
  commonnessWeight: number;

  @OneToMany(() => Task, (task) => task.problem)
  tasks: Task[];

  @ManyToOne(() => Model, (model) => model.problems)
  model: Model;
}
