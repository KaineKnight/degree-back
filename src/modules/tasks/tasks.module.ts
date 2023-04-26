import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import entities from '../../entities';
import { TasksHelperService } from './tasks-helper.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [TasksController],
  providers: [TasksService, TasksHelperService],
})
export class TasksModule {}
