import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from 'src/entities';

import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
