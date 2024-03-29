import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Category } from 'src/entities';
import { ASC_ORDER } from 'src/utils/constants';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CATEGORY_ALREADY_EXISTS, CATEGORY_NOT_FOUND } from './constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const foundCategory: Category = await this.categoryRepository.findOneBy({
      title: createCategoryDto.title,
    });
    if (foundCategory) throw new BadRequestException(CATEGORY_ALREADY_EXISTS);
    const category: Category = await this.categoryRepository.save(
      createCategoryDto,
    );
    return category;
  }

  async findAll(search: string): Promise<Category[]> {
    const categories: Category[] = await this.categoryRepository.find({
      where: { title: Like(`%${search}%`) },
      order: { title: ASC_ORDER },
    });
    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category: Category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(CATEGORY_NOT_FOUND);
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category: Category = await this.findOne(id);
    await this.categoryRepository.update(category, updateCategoryDto);
    return category;
  }

  async remove(id: string): Promise<DeleteResult> {
    const category: Category = await this.findOne(id);
    return await this.categoryRepository.delete(category);
  }
}
