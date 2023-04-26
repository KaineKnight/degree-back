import { Injectable } from '@nestjs/common';

import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  findAll() {
    return `This action returns all users!`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
