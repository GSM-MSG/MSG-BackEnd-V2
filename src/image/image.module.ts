import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { S3 } from 'aws-sdk';

@Module({
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
