import { Test, TestingModule } from '@nestjs/testing';
import { CriterionsService } from './criterions.service';

describe('CriterionsService', () => {
  let service: CriterionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CriterionsService],
    }).compile();

    service = module.get<CriterionsService>(CriterionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
