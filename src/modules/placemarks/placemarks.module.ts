import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from 'src/entities';

import { PlacemarksService } from './placemarks.service';
import { PlacemarksController } from './placemarks.controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [PlacemarksController],
  providers: [PlacemarksService],
})
export class PlacemarksModule {}
