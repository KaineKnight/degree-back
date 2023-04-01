import { Module } from '@nestjs/common';
import { CriterionsService } from './services/criterions.service';
import { CriterionsController } from './controllers/criterions.controller';

@Module({
  controllers: [CriterionsController],
  providers: [CriterionsService]
})
export class CriterionsModule {}
