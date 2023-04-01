import { CreateUserType } from 'src/utils/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  fakeUsers = [
    {
      username: 'Anson',
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

  fetchUserById(id: number) {
    return { id, username: 'Anson', email: 'anson@email.com' };
  }
}
