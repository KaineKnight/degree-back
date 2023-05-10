import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import entities from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
