import { RelatedModelData } from './types/related-model-data.type';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Brand, Model } from 'src/entities';
import { PageDto, PageOptionsDto } from 'src/utils/pagination';

import { CreateModelDto, UpdateModelDto } from './dto';
import { MODEL_ALREADY_EXIST } from './constants';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<Model> {
    const foundModel: Model = await this.modelRepository.findOneBy({
      title: createModelDto.title,
    });
    if (foundModel) throw new BadRequestException(MODEL_ALREADY_EXIST);
    const relatedData: RelatedModelData = {};
    if (createModelDto.brandTitle) {
      const brand = await this.brandRepository.findOneBy({
        title: createModelDto.brandTitle,
      });
      if (brand) relatedData.brand = brand;
    }
    if (createModelDto.categoryTitle) {
      const category = await this.brandRepository.findOneBy({
        title: createModelDto.categoryTitle,
      });
      if (category) relatedData.category = category;
    }
    const model: Model = await this.modelRepository.save({
      ...createModelDto,
      ...relatedData,
    });
    return model;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
  ): Promise<PageDto<Model>> {
    return `This action returns all models`;
  }

  async findOne(id: string): Promise<Model> {
    return `This action returns a #${id} model`;
  }

  async update(id: string, updateModelDto: UpdateModelDto): Promise<Model> {
    return `This action updates a #${id} model`;
  }

  async remove(id: string): Promise<DeleteResult> {
    return `This action removes a #${id} model`;
  }
}
