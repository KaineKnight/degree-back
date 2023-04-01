import { Module } from '@nestjs/common';
import { CriterionsService } from './criterions.service';
import { CriterionsController } from './criterions.controller';

@Module({
  controllers: [CriterionsController],
  providers: [CriterionsService]
})
export class CriterionsModule {}
