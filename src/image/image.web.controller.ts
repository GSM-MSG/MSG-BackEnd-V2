import {
  Bind,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  @UseGuards(AuthGuard('jwtWeb'))
  @Post('')
  @UseInterceptors(FilesInterceptor('files', 4))
  @Bind(UploadedFiles())
  async ImageUpload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.imageService.uploladFile(files);
  }
}
