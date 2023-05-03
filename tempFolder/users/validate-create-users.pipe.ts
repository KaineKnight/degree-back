import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from './../dtos/CreateUser.dto';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateCreateUsersPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    console.log('Inside ValidateCreateUserPipe');
    console.log(value);
    console.log(metadata);
    const parseAgeToInt = parseInt(value.age.toString());
    if (isNaN(parseAgeToInt)) {
      console.log(`${value.age} is not a number!`);
      throw new HttpException(
        'Invalid Data Type for property age. Expected Number',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { ...value, age: parseAgeToInt };
  }
}
