import { Test, TestingModule } from '@nestjs/testing';
import { CriterionsController } from './criterions.controller';
import { CriterionsService } from '../services/criterions.service';

describe('CriterionsController', () => {
  let controller: CriterionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CriterionsService],
      providers: [CriterionsService],
    }).compile();

    controller = module.get<CriterionsController>(CriterionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
