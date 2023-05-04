import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from 'src/entities';

import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
