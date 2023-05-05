import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from './task.entity';
import { Model } from './model.entity';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true }) // hours to complete
  time: number;

  @Column({ nullable: true }) // rubles
  price: number;

  @Column({ default: 0 })
  commonnessWeight: number;

  @OneToMany(() => Task, (task) => task.problem)
  tasks: Task[];

  @ManyToOne(() => Model, (model) => model.problems)
  model: Model;
}
