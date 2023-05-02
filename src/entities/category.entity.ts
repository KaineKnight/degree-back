import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Task } from './task.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ default: 0 })
  weight: number;

  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];
}
