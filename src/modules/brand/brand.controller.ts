import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { PageOptionsDto, PageDto } from 'src/utils/pagination';
import {
  ID_PARAM,
  ID_PROPERTY,
  NO_SEARCH,
  SEARCH_QUERY,
} from 'src/utils/constants';
import { Brand } from 'src/entities';

import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query(SEARCH_QUERY) search: string,
  ): Promise<PageDto<Brand>> {
    return this.brandService.findAll(pageOptionsDto, search ?? NO_SEARCH);
  }

  @Get(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ID_PROPERTY) id: string): Promise<Brand> {
    return this.brandService.findOne(id);
  }

  @Patch(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  update(
    @Param(ID_PROPERTY) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ID_PROPERTY) id: string): Promise<DeleteResult> {
    return this.brandService.remove(id);
  }
}
