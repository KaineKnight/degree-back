import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import entities from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
