import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RtGuard } from 'src/common/guards';
import {
  GetRequestUser,
  GetRequestUserId,
  Public,
} from 'src/common/decorators';

import { AuthService } from './auth.service';
import { AuthLoginDto, AuthSignUpnDto } from './dto';
import { Tokens } from './types/tokens.type';

@ApiTags('Users')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, type: 'Token' })
  @Public()
  @Post('signup')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthSignUpnDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthLoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetRequestUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetRequestUserId() userId: string,
    @GetRequestUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
