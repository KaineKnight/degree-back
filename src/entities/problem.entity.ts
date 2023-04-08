import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  time: number;

  @Column()
  price: number;

  @Column()
  commonnessWeight: number;

  @OneToMany(() => Task, (task) => task.problem)
  tasks: Task[];
}
