import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities';

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type UserTokens = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
