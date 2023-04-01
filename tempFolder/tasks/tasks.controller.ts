import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  ParseIntPipe,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTask(@Param('id', ParseIntPipe) id: number) {
    return id;
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  createTask(@Body() taskData) {
    return { data: taskData };
  }
}
