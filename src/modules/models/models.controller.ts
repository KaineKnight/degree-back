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

import {
  ID_PARAM,
  ID_PROPERTY,
  EMPTY_STRING,
  SEARCH_QUERY,
} from 'src/utils/constants';
import { PageDto, PageOptionsDto } from 'src/utils/pagination';
import { Model } from 'src/entities';

import { ModelsService } from './models.service';
import { CreateModelDto, UpdateModelDto } from './dto';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  create(@Body() createModelDto: CreateModelDto): Promise<Model> {
    return this.modelsService.create(createModelDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query(SEARCH_QUERY) search: string,
  ): Promise<PageDto<Model>> {
    return this.modelsService.findAll(pageOptionsDto, search ?? EMPTY_STRING);
  }

  @Get(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ID_PROPERTY) id: string): Promise<Model> {
    return this.modelsService.findOne(id);
  }

  @Patch(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  update(
    @Param(ID_PROPERTY) id: string,
    @Body() updateModelDto: UpdateModelDto,
  ): Promise<Model> {
    return this.modelsService.update(id, updateModelDto);
  }

  @Delete(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ID_PROPERTY) id: string): Promise<DeleteResult> {
    return this.modelsService.remove(id);
  }
}
