import { Test, TestingModule } from '@nestjs/testing';
import { PlacemarksController } from './placemarks.controller';
import { PlacemarksService } from './placemarks.service';

describe('PlacemarksController', () => {
  let controller: PlacemarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacemarksController],
      providers: [PlacemarksService],
    }).compile();

    controller = module.get<PlacemarksController>(PlacemarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
