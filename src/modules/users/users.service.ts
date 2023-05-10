import { USER_NOT_FOUND } from './../../utils/constants';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { DeleteResult, Like, Repository } from 'typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/pagination';
import { ASC_ORDER } from 'src/utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    pageOptionsDto: PageOptionsDto,
    search: string,
  ): Promise<PageDto<User>> {
    const { order, skip, take } = pageOptionsDto;
    const [data, itemCount] = await this.userRepository.findAndCount({
      where: [
        { firstName: Like(`%${search}%`) },
        { lastName: Like(`%${search}%`) },
      ],
      relations: ['tasks', 'tasks.task'],
      order: { lastName: order },
      skip,
      take,
    });
    const meta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, meta);
  }

  async findOne(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id },
      relations: ['tasks', 'tasks.task'],
      order: { tasks: { task: { title: ASC_ORDER } } },
    });
    if (!user) throw new NotFoundException(USER_NOT_FOUND);
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const imagePath = file && `/uploads/profile/${file.filename}`;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    await this.userRepository.update(user, {
      ...updateUserDto,
      profileImage: imagePath,
    });
    return user;
  }

  async remove(id: string): Promise<DeleteResult> {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(USER_NOT_FOUND);
    return await this.userRepository.delete(user);
  }
}
