import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';

import entities from 'src/entities';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    MulterModule.register({
      dest: './uploads/profile',
      limits: { fileSize: 1024 * 1024 * 10 }, // bytes * 1024 * 10 = 10mb
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
