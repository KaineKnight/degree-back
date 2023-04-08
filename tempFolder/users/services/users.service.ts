import { CreateUserType } from 'src/utils/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  fakeUsers = [
    {
      username: 'AnSon',
      email: 'anson@anson.com',
    },
    {
      username: 'Hanson',
      email: 'anson@anson.com',
    },
    {
      username: 'Manson',
      email: 'anson@anson.com',
    },
  ];

  fetchUsers() {
    return this.fakeUsers;
  }

  createUser(userDetails: CreateUserType) {
    return 0;
  }

  fetchUserById(id: string) {
    return { id, username: 'AnSon', email: 'anSon@email.com' };
  }
}
