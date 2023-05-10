import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Query,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult } from 'typeorm';

import {
  EMPTY_STRING,
  ID_PARAM,
  ID_PROPERTY,
  SEARCH_QUERY,
} from 'src/utils/constants';
import { GetRequestUserId, Public } from 'src/common/decorators';
import { PageDto, PageOptionsDto } from 'src/utils/pagination';
import { User } from 'src/entities';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { IMAGE_PROPERTY } from './constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query(SEARCH_QUERY) search: string,
  ): Promise<PageDto<User>> {
    return this.usersService.findAll(pageOptionsDto, search ?? EMPTY_STRING);
  }

  @Public()
  @Get(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ID_PROPERTY) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor(IMAGE_PROPERTY))
  update(
    @Param(ID_PROPERTY) id: string,
    @GetRequestUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    if (id !== userId) throw new BadRequestException();
    return this.usersService.update(id, updateUserDto, file);
  }

  @Delete(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ID_PROPERTY) id: string): Promise<DeleteResult> {
    return this.usersService.remove(id);
  }
}
