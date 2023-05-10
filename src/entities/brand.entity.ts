import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Model } from './model.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ default: 0 })
  weight: number;

  @OneToMany(() => Model, (model) => model.brand)
  models: Model[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
/*
1. choose category: mobile, tablet etc...
2. choose brand: Apple, Nvidia, Microsoft etc...
3. choose model: iPhone 5, MiBand 7,
4. choose problem: cracked screen, bad battery
5. describe your problem
*/
