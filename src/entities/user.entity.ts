/* eslint prettier/prettier: 0 */
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Criterion } from './criterion.entity';
import { TaskUser } from './task-user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: '1', description: 'Unique ID'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'em@il.com', description: 'User email'})
  @Column({ unique: true })
  email: string;
  
  @ApiProperty({ example: 'LiUEdSdfsJq31', description: 'User password\'s hash'})
  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ example: 'John', description: 'User Name'})
  @Column()
  name: string;

  @ApiProperty({ example: 'https://host.com/img.jpg', description: 'User Avatar'})
  @Column({ nullable: true })
  profileImage: string;

  @ApiProperty({ example: 'alk23DSdf653KFLVNasfwe5r63Ckedlf', description: 'User Hash for refresh token'})
  @Exclude()
  @Column({ nullable: true })
  hashedRt: string;

  @ApiProperty({ example: '2023-11-11', description: 'Creation date'})
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-12-12', description: 'Update date'})
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: '2024-01-01', description: 'Deletion date'})
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty({ example: '[]', description: 'Criterions related table'})
  @ManyToMany(() => Criterion)
  @JoinTable()
  criterions: Criterion[];

  @ApiProperty({ example: '[]', description: 'Tasks related table'})
  @OneToMany(() => TaskUser, (tasks) => tasks.user)
  tasks: TaskUser[];
}
