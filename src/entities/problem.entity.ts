import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Task } from './task.entity';

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
}
