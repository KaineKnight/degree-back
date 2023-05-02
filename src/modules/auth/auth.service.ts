import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IsNull, Not, Repository } from 'typeorm';

import { User } from '../../entities';

import { Tokens } from './types';
import { AuthLoginDto, AuthSignUpnDto } from './dto';
import { AuthHelperService } from './auth-helper.service';
import { ACCESS_DENIED, USER_ALREADY_EXISTS } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authHelper: AuthHelperService,
  ) {}

  async signup(signUpDto: AuthSignUpnDto): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({
      email: signUpDto.email,
    });
    if (user) throw new BadRequestException(USER_ALREADY_EXISTS);
    const hash = await this.authHelper.hashData(signUpDto.password);

    const newUser = await this.userRepository.save({
      ...signUpDto,
      password: hash,
    });

    const tokens = await this.authHelper.getTokens(newUser);
    await this.authHelper.updateRtHash(newUser, tokens.refresh_token);
    return tokens;
  }

  async login(loginDto: AuthLoginDto): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) throw new ForbiddenException(ACCESS_DENIED);
    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatches) throw new ForbiddenException(ACCESS_DENIED);

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
    if (!user || !user.hashedRt) throw new ForbiddenException(ACCESS_DENIED);

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException(ACCESS_DENIED);

    const tokens = await this.authHelper.getTokens(user);
    await this.authHelper.updateRtHash(user, tokens.refresh_token);
    return tokens;
  }

  // async checkToken() {}
}
