import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class ImageService {
  async uploladFile(files: Array<Express.Multer.File>) {}
}
