import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IsNull, Not, Repository } from 'typeorm';

import { User } from '../../entities';

import { Tokens } from './types';
import { AuthLoginDto, AuthSignUpnDto } from './dto';
import { AuthHelperService } from './auth-helper.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private authHelper: AuthHelperService,
  ) {}

  async signup(dto: AuthSignUpnDto): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (user) throw new BadRequestException('User Already exist');
    const hash = await this.authHelper.hashData(dto.password);

    const newUser = await this.userRepository.save({
      ...dto,
      password: hash,
    });

    const tokens = await this.authHelper.getTokens(newUser);
    await this.authHelper.updateRtHash(newUser, tokens.refresh_token);
    return tokens;
  }

  async login(dto: AuthLoginDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.authHelper.getTokens(user);
    await this.authHelper.updateRtHash(user, tokens.refresh_token);
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

  async refreshTokens(userId: string, rt: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.authHelper.getTokens(user);
    await this.authHelper.updateRtHash(user, tokens.refresh_token);
    return tokens;
  }

  // async checkToken() {}
}
