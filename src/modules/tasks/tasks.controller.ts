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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { PageOptionsDto, PageDto } from '../../utils/pagination';
import { GetRequestUserId, Public } from '../../common/decorators';
import {
  ID_PARAM,
  ID_PROPERTY,
  NO_SEARCH,
  SEARCH_QUERY,
} from 'src/utils/constants';
import { Task } from 'src/entities';

import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @GetRequestUserId() userId: string,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query(SEARCH_QUERY) search: string,
    @Query('isRecommendation') isRecommendation: boolean,
  ): Promise<PageDto<Task>> {
    return this.tasksService.findAll(
      pageOptionsDto,
      search ?? NO_SEARCH,
      userId,
      isRecommendation ?? false,
    );
  }

  @Get(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ID_PROPERTY) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ID_PROPERTY) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ID_PROPERTY) id: string): Promise<DeleteResult> {
    return this.tasksService.remove(id);
  }
}
