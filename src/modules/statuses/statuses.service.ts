import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/pagination';
import { Status } from 'src/entities';

import { CreateStatusDto, UpdateStatusDto } from './dto';
import { STATUS_ALREADY_EXISTS, STATUS_NOT_FOUND } from './constants';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    const foundStatus: Status = await this.statusRepository.findOneBy({
      title: createStatusDto.title,
    });
    if (foundStatus) throw new BadRequestException(STATUS_ALREADY_EXISTS);
    const status = await this.statusRepository.save(createStatusDto);
    return status;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
  ): Promise<PageDto<Status>> {
    const { take, skip, order } = pageOptionsDto;
    const [data, itemCount] = await this.statusRepository.findAndCount({
      where: { title: Like(`%${search}%`) },
      order: { title: order },
      take,
      skip,
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async findOne(id: string): Promise<Status> {
    const status: Status = await this.statusRepository.findOneBy({ id });
    if (!status) throw new NotFoundException(STATUS_NOT_FOUND);
    return status;
  }

  async update(id: string, updateStatusDto: UpdateStatusDto): Promise<Status> {
    const status: Status = await this.findOne(id);
    await this.statusRepository.update(status, updateStatusDto);
    return status;
  }

  async remove(id: string): Promise<DeleteResult> {
    const status: Status = await this.findOne(id);
    return await this.statusRepository.delete(status);
  }
}
