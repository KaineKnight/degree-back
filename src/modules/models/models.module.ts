import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from 'src/entities';

import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [ModelsController],
  providers: [ModelsService],
})
export class ModelsModule {}
