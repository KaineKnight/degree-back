import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { typeOrmConfigAsync } from './config';
import { AuthModule } from './modules/auth/auth.module';

import CriterionsModule from './modules/criterion';
import UsersModule from './modules/users';
import TasksModule from './modules/tasks';
import { AtGuard } from './common/guards';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TasksModule,
    UsersModule,
    CriterionsModule,
    AuthModule,
    RolesModule,
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
