import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/entities';
import { IsNull, Not, Repository } from 'typeorm';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto, AuthSignUpnDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.AT_SECRET,
          expiresIn: 60 * 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.RT_SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signup(dto: AuthSignUpnDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.userRepository.save({
      ...dto,
      password: hash,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.userRepository.update(
      {
        id: userId,
      },
      {
        hashedRt: hash,
      },
    );
  }

  async login(dto: AuthLoginDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const passwordMathes = await bcrypt.compare(dto.password, user.password);
    if (!passwordMathes) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId) {
    await this.userRepository.update(
      {
        id: userId,
        hashedRt: Not(IsNull()),
      },
      {
        hashedRt: null,
      },
    );
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async checkToken() {}
}
