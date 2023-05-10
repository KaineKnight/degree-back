import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { ASC_ORDER } from 'src/utils/constants';
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

  async findAll(search: string): Promise<Status[]> {
    const statuses: Status[] = await this.statusRepository.find({
      where: { title: Like(`%${search}%`) },
      order: { title: ASC_ORDER },
    });
    return statuses;
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
