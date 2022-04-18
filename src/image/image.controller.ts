import {
  Bind,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(UploadedFiles())
  async ImageUpload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.imageService.uploladFile(files);
  }
}
