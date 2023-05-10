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
  ParseBoolPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { PageOptionsDto, PageDto } from '../../utils/pagination';
import { GetRequestUserId, Public } from '../../common/decorators';
import { ID_PARAM, ID_PROPERTY } from 'src/utils/constants';
import { Task, User } from 'src/entities';

import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskFilterDto } from './dto/task-filter.dto';

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
    @Query() taskFilterDto: TaskFilterDto,
  ): Promise<PageDto<Task>> {
    return this.tasksService.findAll(pageOptionsDto, taskFilterDto, userId);
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

  @Post(`${ID_PARAM}/accept`)
  @HttpCode(HttpStatus.OK)
  acceptTaskByUser(
    @GetRequestUserId() userId: string,
    @Param(ID_PROPERTY) taskId: string,
  ): Promise<User> {
    return this.tasksService.acceptTaskByUser(userId, taskId);
  }

  @Post(`${ID_PARAM}/reject`)
  @HttpCode(HttpStatus.OK)
  rejectTaskByUser(
    @GetRequestUserId() userId: string,
    @Param(ID_PROPERTY) taskId: string,
    @Query('isRejected', ParseBoolPipe) isRejected: boolean,
  ): Promise<User> {
    return this.tasksService.rejectTaskByUser(userId, taskId, isRejected);
  }
}
