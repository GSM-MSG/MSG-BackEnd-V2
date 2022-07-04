import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  constructor(private configService: ConfigService) {}
  AWS_S3_BUCKET = this.configService.get<string>('AWS_BUCKET');
  s3 = new AWS.S3({
    accessKeyId: this.configService.get('AWSAccessKeyId'),
    secretAccessKey: this.configService.get('AWSSecretKey'),
  });

  async uploladFile(files: Express.Multer.File[]) {
    const list = [];

    if (files.length > 4) {
      throw new HttpException(
        '이미지를 너무 많이 보냈습니다',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const element of files) {
      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: element.originalname,
        Body: element.buffer,
        ACL: 'public-read',
        ContenctType: element.mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: this.configService.get<string>('AWS_RESION'),
        },
      };
      try {
        const result = await this.s3.upload(params).promise();
        list.push(result.Location);
      } catch (e) {
        throw new BadRequestException(e);
      }
    }
    if (list.length > 4) {
      throw new HttpException('요청을 다시 보내주세요', HttpStatus.BAD_REQUEST);
    }
    return list;
  }
}
