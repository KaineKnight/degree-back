import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Problem } from './problem.entity';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity('models')
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ default: 0 })
  weight: number;

  @OneToMany(() => Problem, (problem) => problem.model)
  problems: Problem[];

  @ManyToOne(() => Brand, (brand) => brand.models)
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.models)
  category: Category;
}
