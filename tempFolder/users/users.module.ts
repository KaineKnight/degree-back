// import {
//   Module,
//   MiddlewareConsumer,
//   RequestMethod,
//   NestModule,
// } from '@nestjs/common';

// import { UsersMiddleware } from './users.middleware';
// import { UsersController } from './controllers/users.controller';
// import { UsersService } from './users.service';

// @Module({
//   controllers: [UsersController],
//   providers: [UsersService],
// })
// export class UsersModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(UsersMiddleware)
//       .forRoutes(
//         {
//           path: 'api/users',
//           method: RequestMethod.POST,
//         },
//         {
//           path: 'api/users/:id',
//           method: RequestMethod.GET,
//         },
//       )
//       // .exclude('api/users/route/exclude')
//       .apply(UsersMiddleware)
//       .forRoutes(
//         {
//           path: 'api/users',
//           method: RequestMethod.POST,
//         },
//         {
//           path: 'api/users/:id',
//           method: RequestMethod.GET,
//         },
//       );
//   }
// }
