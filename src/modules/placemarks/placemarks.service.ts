import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Placemark } from 'src/entities/placemark.entity';

import { CreatePlacemarkDto, UpdatePlacemarkDto } from './dto';
import { PLACEMARK_ALREADY_EXISTS, PLACEMARK_NOT_FOUND } from './constants';

@Injectable()
export class PlacemarksService {
  constructor(
    @InjectRepository(Placemark)
    private readonly placemarkRepository: Repository<Placemark>,
  ) {}

  async create(createPlacemarkDto: CreatePlacemarkDto): Promise<Placemark> {
    const foundPlaceMark: Placemark = await this.placemarkRepository.findOneBy({
      x: createPlacemarkDto.x,
      y: createPlacemarkDto.y,
    });
    if (foundPlaceMark) throw new BadRequestException(PLACEMARK_ALREADY_EXISTS);
    const placemark: Placemark = await this.placemarkRepository.save(
      createPlacemarkDto,
    );
    return placemark;
  }

  async findAll(): Promise<Placemark[]> {
    return await this.placemarkRepository.find();
  }

  async findOne(id: string): Promise<Placemark> {
    const placemark: Placemark = await this.placemarkRepository.findOneBy({
      id,
    });
    if (!placemark) throw new NotFoundException(PLACEMARK_NOT_FOUND);
    return placemark;
  }

  async update(
    id: string,
    updatePlacemarkDto: UpdatePlacemarkDto,
  ): Promise<Placemark> {
    const placemark: Placemark = await this.findOne(id);
    await this.placemarkRepository.update(placemark, updatePlacemarkDto);
    return placemark;
  }

  async remove(id: string): Promise<DeleteResult> {
    const placemark: Placemark = await this.findOne(id);
    return await this.placemarkRepository.delete(placemark);
  }
}
