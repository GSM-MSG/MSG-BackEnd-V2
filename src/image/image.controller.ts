import {
  Bind,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Public()
  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(UploadedFiles())
  async ImageUpload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.imageService.uploladFile(files);
  }
}
