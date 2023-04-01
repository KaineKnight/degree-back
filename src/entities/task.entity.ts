import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  trackNumber: string;

  @Column()
  contactName: string;

  @Column()
  contactPhone: string;

  @Column()
  contactEmail: string;
}
