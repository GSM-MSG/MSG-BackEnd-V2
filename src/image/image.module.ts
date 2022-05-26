import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { ImageWebController } from './image.web.controller';

@Module({
  providers: [ImageService],
  controllers: [ImageController, ImageWebController],
})
export class ImageModule {}
