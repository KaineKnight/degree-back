import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Model } from './model.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ default: 0 })
  weight: number;

  @OneToMany(() => Model, (model) => model.category)
  models: Model[];
}
