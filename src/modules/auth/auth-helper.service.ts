import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/entities';

import { Tokens } from './types';

@Injectable()
export class AuthHelperService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(user: User): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, user },
        { secret: process.env.AT_SECRET, expiresIn: 60 * 60 * 15 },
      ),
      this.jwtService.signAsync(
        { sub: user.id, user },
        { secret: process.env.RT_SECRET, expiresIn: 60 * 60 * 24 * 7 },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(user: User, rt: string) {
    const hash = await this.hashData(rt);
    await this.userRepository.update({ id: user.id }, { hashedRt: hash });
  }
}
