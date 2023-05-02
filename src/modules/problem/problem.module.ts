import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from 'src/entities';

import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [ProblemController],
  providers: [ProblemService],
})
export class ProblemModule {}
