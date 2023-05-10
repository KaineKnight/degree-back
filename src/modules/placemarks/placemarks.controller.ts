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
} from '@nestjs/common';

import { PlacemarksService } from './placemarks.service';
import { CreatePlacemarkDto, UpdatePlacemarkDto } from './dto';
import { Public } from 'src/common/decorators';
import { Placemark } from 'src/entities/placemark.entity';
import { ID_PARAM, ID_PROPERTY } from 'src/utils/constants';
import { DeleteResult } from 'typeorm';

@Controller('placemarks')
export class PlacemarksController {
  constructor(private readonly placemarksService: PlacemarksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  create(@Body() createPlacemarkDto: CreatePlacemarkDto): Promise<Placemark> {
    return this.placemarksService.create(createPlacemarkDto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Placemark[]> {
    return this.placemarksService.findAll();
  }

  @Public()
  @Get(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ID_PROPERTY) id: string): Promise<Placemark> {
    return this.placemarksService.findOne(id);
  }

  @Patch(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  update(
    @Param(ID_PROPERTY) id: string,
    @Body() updatePlacemarkDto: UpdatePlacemarkDto,
  ): Promise<Placemark> {
    return this.placemarksService.update(id, updatePlacemarkDto);
  }

  @Delete(ID_PARAM)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ID_PROPERTY) id: string): Promise<DeleteResult> {
    return this.placemarksService.remove(id);
  }
}
