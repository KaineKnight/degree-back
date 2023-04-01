import { ValidateCreateUsersPipe } from './../pipes/validate-create-users.pipe';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/')
  getUsers(@Query('sortBy') sortBy: string) {
    return this.usersService.fetchUsers();
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  createUser(@Body(ValidateCreateUsersPipe) userData: CreateUserDto) {
    return this.usersService.createUser(userData);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.fetchUserById(id);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return user;
  }
}
