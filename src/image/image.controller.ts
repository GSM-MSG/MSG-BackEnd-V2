import {
  Bind,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from './image.service';
@ApiTags('IMAGE')
@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '사진 업로드',
    description: '사진을 S3에 업로드합니다',
  })
  @ApiBody({ isArray: true })
  @ApiResponse({ status: 200, description: 's3주소 반환' })
  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  @Bind(UploadedFiles())
  async ImageUpload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.imageService.uploladFile(files);
  }
}
