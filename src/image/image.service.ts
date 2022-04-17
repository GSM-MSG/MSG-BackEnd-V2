import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  constructor(private configService: ConfigService) {}
  AWS_S3_BUCKET = process.env.AWS_BUCKET; //추후 버킷으로 변경
  s3 = new AWS.S3({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
  });

  async uploladFile(files: Array<Express.Multer.File>) {
    files.forEach(async (element) => {
      const param = {
        Bucket: this.AWS_S3_BUCKET,
        key: element.originalname,
        Body: element.buffer,
        ACL: 'public-read',
        ContenctType: element.mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: this.configService.get<string>('AWS_REGION'),
        },
      };
      try {
      } catch (e) {}
    });
  }
}
