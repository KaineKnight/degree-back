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

import { Problem } from 'src/entities';
import { PageDto, PageOptionsDto } from 'src/utils/pagination';
import {
  ID_PARAM,
  ID_PROPERTY,
  EMPTY_STRING,
  SEARCH_QUERY,
} from 'src/utils/constants';

import { ProblemsService } from './problems.service';
import { CreateProblemDto, UpdateProblemDto } from './dto';

@Controller('problem')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  create(@Body() createProblemDto: CreateProblemDto): Promise<Problem> {
    return this.problemsService.create(createProblemDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query(SEARCH_QUERY) search: string,
  ): Promise<PageDto<Problem>> {
    return this.problemsService.findAll(pageOptionsDto, search ?? EMPTY_STRING);
  }

  @Get(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ID_PROPERTY) id: string): Promise<Problem> {
    return this.problemsService.findOne(id);
  }

  @Patch(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  update(
    @Param(ID_PROPERTY) id: string,
    @Body() updateProblemDto: UpdateProblemDto,
  ): Promise<Problem> {
    return this.problemsService.update(id, updateProblemDto);
  }

  @Delete(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ID_PROPERTY) id: string): Promise<DeleteResult> {
    return this.problemsService.remove(id);
  }
}
