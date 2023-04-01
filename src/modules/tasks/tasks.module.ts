import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
