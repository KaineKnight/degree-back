import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class UsersFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
