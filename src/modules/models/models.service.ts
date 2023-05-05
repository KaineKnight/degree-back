import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Brand, Category, Model } from 'src/entities';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/pagination';

import { CreateModelDto, UpdateModelDto } from './dto';
import { MODEL_ALREADY_EXIST, MODEL_NOT_FOUND } from './constants';
import { RelatedModelData } from './types';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<Model> {
    const foundModel: Model = await this.modelRepository.findOneBy({
      title: createModelDto.title,
    });
    if (foundModel) throw new BadRequestException(MODEL_ALREADY_EXIST);

    const brand: Brand =
      createModelDto.brandTitle &&
      (await this.brandRepository.findOneBy({
        title: createModelDto.brandTitle,
      }));
    const category: Category =
      createModelDto.categoryTitle &&
      (await this.categoryRepository.findOneBy({
        title: createModelDto.categoryTitle,
      }));

    const model: Model = await this.modelRepository.save({
      ...createModelDto,
      brand,
      category,
    });
    return model;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
  ): Promise<PageDto<Model>> {
    const { order, skip, take } = pageOptionsDto;
    const [data, itemCount] = await this.modelRepository.findAndCount({
      where: { title: Like(`%${search}%`) },
      relations: ['brand', 'category'],
      order: { title: order },
      skip,
      take,
    });
    const meta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, meta);
  }

  async findOne(id: string): Promise<Model> {
    const model: Model = await this.modelRepository.findOne({
      where: { id },
      relations: ['brand', 'category'],
    });
    if (!model) throw new NotFoundException(MODEL_NOT_FOUND);
    return model;
  }

  async update(id: string, updateModelDto: UpdateModelDto): Promise<Model> {
    const model: Model = await this.findOne(id);

    const isBrandUpdating: boolean =
      updateModelDto.brandTitle &&
      updateModelDto.brandTitle !== model.brand.title;
    const isCategoryUpdating: boolean =
      updateModelDto.categoryTitle &&
      updateModelDto.categoryTitle !== model.category.title;

    const brand: Brand =
      isBrandUpdating &&
      (await this.brandRepository.findOneBy({
        title: updateModelDto.brandTitle,
      }));
    const category: Category =
      isCategoryUpdating &&
      (await this.categoryRepository.findOneBy({
        title: updateModelDto.categoryTitle,
      }));

    const relatedData: RelatedModelData = {};
    if (brand) relatedData.brand = brand;
    if (category) relatedData.category = category;

    await this.modelRepository.update(model, {
      ...updateModelDto,
      ...relatedData,
    });
    return model;
  }

  async remove(id: string): Promise<DeleteResult> {
    const model: Model = await this.modelRepository.findOneBy({ id });
    if (!model) throw new NotFoundException(MODEL_NOT_FOUND);
    return await this.modelRepository.delete(model);
  }
}
