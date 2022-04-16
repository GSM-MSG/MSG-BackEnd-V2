import { Controller, Post, UploadedFiles } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('')
  async ImageUpload(@UploadedFiles() files) {
    return this.imageService.uploladFile(files);
  }
}
