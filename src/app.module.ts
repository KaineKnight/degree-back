import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { typeOrmConfigAsync } from './config';
import { AuthModule } from './modules/auth/auth.module';

import UsersModule from './modules/users';
import TasksModule from './modules/tasks';
import { AtGuard } from './common/guards';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { ProblemModule } from './modules/problem/problem.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TasksModule,
    UsersModule,
    AuthModule,
    BrandModule,
    CategoryModule,
    ProblemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
