import { PageDto } from './../../utils/pagination/page.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from 'src/entities';
import { PageOptionsDto } from 'src/utils/pagination';
import { ID_PARAM, ID_PROPERTY, EMPTY_STRING, SEARCH_QUERY } from 'src/utils/constants';
import { DeleteResult } from 'typeorm';

@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  create(@Body() createStatusDto: CreateStatusDto): Promise<Status> {
    return this.statusesService.create(createStatusDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query(SEARCH_QUERY) search: string,
  ): Promise<PageDto<Status>> {
    return this.statusesService.findAll(pageOptionsDto, search ?? EMPTY_STRING);
  }

  @Get(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ID_PROPERTY) id: string): Promise<Status> {
    return this.statusesService.findOne(id);
  }

  @Patch(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  update(
    @Param(ID_PROPERTY) id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<Status> {
    return this.statusesService.update(id, updateStatusDto);
  }

  @Delete(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ID_PROPERTY) id: string): Promise<DeleteResult> {
    return this.statusesService.remove(id);
  }
}
