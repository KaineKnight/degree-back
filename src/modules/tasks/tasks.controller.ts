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
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PageOptionsDto } from '../../utils/pagination/page-options.dto';
import { GetRequestUserId } from '../../common/decorators/get-request-user-id.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @GetRequestUserId() userId: string,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('searchTemplate') searchTemplate: string,
  ) {
    return this.tasksService.findAll(pageOptionsDto, searchTemplate, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
