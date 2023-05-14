/* eslint prettier/prettier: 0 */
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { TaskUser } from './task-user.entity';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: '1', description: 'Unique ID'})
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'em@il.com', description: 'User email'})
  @Column({ unique: true })
  email: string;
  
  @ApiProperty({ example: 'LiUEdSdfsJq31', description: 'User password\'s hash'})
  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ example: 'John', description: 'User First Name'})
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User Last Name'})
  @Column()
  lastName: string;

  @ApiProperty({ example: 'https://host.com/img.jpg', description: 'User Avatar'})
  @Column({ nullable: true })
  profileImage: string;

  @ApiProperty({ example: 'alk23DSdf653KfLVNasFe5r63CkeDlf', description: 'User Hash for refresh token'})
  @Exclude()
  @Column({ nullable: true })
  hashedRt: string;

  @ApiProperty({ example: '1 1 1 1 1 1', description: 'Users\'s priorities'})
  @Column({default: '1 1 1 1 1 1'})
  priorities: string;

  @ApiProperty({ example: '2023-11-11', description: 'Creation date'})
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-12-12', description: 'Update date'})
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: '2024-01-01', description: 'Deletion date'})
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty({ example: '[]', description: 'Tasks related table'})
  @OneToMany(() => TaskUser, (tasks) => tasks.user, { cascade: true })
  tasks: TaskUser[];

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
