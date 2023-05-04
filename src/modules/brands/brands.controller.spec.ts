import { Test, TestingModule } from '@nestjs/testing';

import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

describe('BrandController', () => {
  let controller: BrandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [BrandsService],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
