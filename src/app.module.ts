import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CriterionsModule } from './modules/criterions/criterions.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [TasksModule, UsersModule, CriterionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
