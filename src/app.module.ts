import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { typeOrmConfigAsync } from './config';
import { AuthModule } from './modules/auth/auth.module';

import CriterionsModule from './modules/criterions';
import UsersModule from './modules/users';
import TasksModule from './modules/tasks';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TasksModule,
    UsersModule,
    CriterionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
