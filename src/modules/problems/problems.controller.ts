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
import {
  ID_PARAM,
  ID_PROPERTY,
  EMPTY_STRING,
  SEARCH_QUERY,
} from 'src/utils/constants';
import { Public } from 'src/common/decorators';

import { ProblemsService } from './problems.service';
import { CreateProblemDto, UpdateProblemDto } from './dto';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  create(@Body() createProblemDto: CreateProblemDto): Promise<Problem> {
    return this.problemsService.create(createProblemDto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query(SEARCH_QUERY) search: string): Promise<Problem[]> {
    return this.problemsService.findAll(search ?? EMPTY_STRING);
  }

  @Public()
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
