import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Post('login')
  login() {
    this.authService.login();
  }

  @Post('/logout')
  logout() {
    this.authService.logout();
  }

  @Post('refresh')
  refreshTokens() {
    this.authService.refreshTokens();
  }
}
