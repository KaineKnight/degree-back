import { Test, TestingModule } from '@nestjs/testing';
import { PlacemarksService } from './placemarks.service';

describe('PlacemarksService', () => {
  let service: PlacemarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacemarksService],
    }).compile();

    service = module.get<PlacemarksService>(PlacemarksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
