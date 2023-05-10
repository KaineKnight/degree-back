import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Brand } from 'src/entities';
import { ASC_ORDER } from 'src/utils/constants';

import { CreateBrandDto, UpdateBrandDto } from './dto';
import { BRAND_ALREADY_EXISTS, BRAND_NOT_FOUND } from './constants';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const foundBrand: Brand = await this.brandRepository.findOneBy({
      title: createBrandDto.title,
    });
    if (foundBrand) throw new BadRequestException(BRAND_ALREADY_EXISTS);
    const brand: Brand = await this.brandRepository.save(createBrandDto);
    return brand;
  }

  async findAll(search: string): Promise<Brand[]> {
    const brands: Brand[] = await this.brandRepository.find({
      where: { title: Like(`%${search}%`) },
      order: { title: ASC_ORDER },
    });
    return brands;
  }

  async findOne(id: string): Promise<Brand> {
    const brand: Brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException(BRAND_NOT_FOUND);
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand: Brand = await this.findOne(id);
    await this.brandRepository.update(brand, updateBrandDto);
    return brand;
  }

  async remove(id: string): Promise<DeleteResult> {
    const brand: Brand = await this.findOne(id);
    return await this.brandRepository.delete(brand);
  }
}
