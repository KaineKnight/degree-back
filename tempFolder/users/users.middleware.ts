// import {
//   Injectable,
//   NestMiddleware,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';

// @Injectable()
// export class UsersMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     console.log('Example');
//     console.log(req.headers.authorization);
//     const { authorization } = req.headers;
//     if (!authorization)
//       throw new HttpException('No Auth token', HttpStatus.FORBIDDEN);
//     if (authorization === '123') next();
//     else throw new HttpException('Invalid Auth Token', HttpStatus.FORBIDDEN);
//   }
// }
