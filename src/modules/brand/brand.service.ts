import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { Brand } from 'src/entities';
import { PageOptionsDto } from 'src/utils/pagination/page-options.dto';
import { PageDto } from 'src/utils/pagination/page.dto';
import { PageMetaDto } from 'src/utils/pagination/page-meta.dto';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BRAND_ALREADY_EXISTS, BRAND_NOT_FOUND } from './constants';

@Injectable()
export class BrandService {
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

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
  ): Promise<PageDto<Brand>> {
    const { take, skip, order } = pageOptionsDto;
    const [data, itemCount] = await this.brandRepository.findAndCount({
      where: { title: Like(`%${search}%`) },
      order: { title: order },
      take,
      skip,
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async findOne(id: string): Promise<Brand> {
    const brand: Brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException(BRAND_NOT_FOUND);
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand: Brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException(BRAND_NOT_FOUND);
    await this.brandRepository.update(brand, updateBrandDto);
    return brand;
  }

  async remove(id: string): Promise<DeleteResult> {
    const brand: Brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException(BRAND_NOT_FOUND);
    return await this.brandRepository.delete(brand);
  }
}