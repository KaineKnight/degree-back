import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/pagination';
import { Role } from 'src/entities';

import { CreateRoleDto, UpdateRoleDto } from './dto';
import { ROLE_ALREADY_EXISTS, ROLE_NOT_FOUND } from './constants';
import { ASC_ORDER } from 'src/utils/constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const foundRole: Role = await this.roleRepository.findOneBy({
      title: createRoleDto.title,
    });
    if (foundRole) throw new BadRequestException(ROLE_ALREADY_EXISTS);
    const role: Role = await this.roleRepository.save(createRoleDto);
    return role;
  }

  async findAll(search: string): Promise<Role[]> {
    const roles: Role[] = await this.roleRepository.find({
      where: { title: Like(`%${search}%`) },
      order: { title: ASC_ORDER },
    });
    return roles;
  }

  async findOne(id: string): Promise<Role> {
    const role: Role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(ROLE_NOT_FOUND);
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role: Role = await this.findOne(id);
    await this.roleRepository.update(role, updateRoleDto);
    return role;
  }

  async remove(id: string): Promise<DeleteResult> {
    const role: Role = await this.findOne(id);
    return await this.roleRepository.delete(role);
  }
}
