import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { S3 } from 'aws-sdk';

@Module({
  providers: [
    ImageService,
    {
      provide: S3,
      useFactory: () =>
        new S3({
          accessKeyId: process.env.AWSAccessKeyId,
          secretAccessKey: process.env.AWSSecretKey,
        }),
    },
  ],
  controllers: [ImageController],
})
export class ImageModule {}
