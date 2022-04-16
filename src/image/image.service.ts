import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class ImageService {
  AWS_S3_BUCKET = process.env.TZ; //TZ를 BUCKET으로 변경
  s3 = new AWS.S3({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
  });
  async uploladFile(files) {}
  async s3Upload(files) {}
}
