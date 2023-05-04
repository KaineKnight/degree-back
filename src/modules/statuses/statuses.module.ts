import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [StatusesController],
  providers: [StatusesService],
})
export class StatusesModule {}
