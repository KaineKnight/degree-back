import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfigAsync } from './config';
import { AtGuard } from './common/guards';
import {
  AuthModule,
  BrandsModule,
  CategoriesModule,
  ProblemsModule,
  TasksModule,
  UsersModule,
  RolesModule,
  ModelsModule,
  StatusesModule,
  PlacemarksModule,
  QuestionsModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    BrandsModule,
    CategoriesModule,
    ProblemsModule,
    TasksModule,
    UsersModule,
    RolesModule,
    ModelsModule,
    StatusesModule,
    PlacemarksModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AtGuard }],
})
export class AppModule {}
