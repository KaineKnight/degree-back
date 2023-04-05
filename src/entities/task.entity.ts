import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskUser } from './task-user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @Generated('uuid')
  trackNumber: string;

  @Column()
  contactName: string;

  @Column()
  contactPhone: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => TaskUser, (user) => user.task)
  users: TaskUser[];
}
