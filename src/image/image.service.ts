import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  constructor(private configService: ConfigService) {}
  AWS_S3_BUCKET = this.configService.get<string>('AWS_BUCKET'); //추후 버킷으로 변경
  s3 = new AWS.S3({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
  });

  async uploladFile(files: Array<Express.Multer.File>) {
    const list = [];
    files.forEach(async (element) => {
      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: element.originalname,
        Body: element.buffer,
        ACL: 'public-read',
        ContenctType: element.mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: this.configService.get<string>('AWS_REGION'),
        },
      };
      try {
        const result = this.s3.upload(params).promise().then();
        list.push((await result).Location);
      } catch (e) {}
    });
    return list;
  }
}
