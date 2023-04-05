import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import entities from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
