import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from 'src/entities';

import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule {}
