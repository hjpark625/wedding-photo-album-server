import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  constructor(private configureService: ConfigService) {
    this.region = this.configureService.get<string>('AWS_REGION') || '';
    this.bucket = this.configureService.get<string>('AWS_S3_BUCKET_NAME') || '';

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configureService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configureService.get<string>('AWS_SECRET_ACCESS_KEY') || ''
      }
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const imagePath = `images/${uuid()}.${ext}`;
    const cloudfrontUrl = this.configureService.get<string>('AWS_CLOUDFRONT_DOMAIN') || '';

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: imagePath,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    );

    return cloudfrontUrl + imagePath;
  }
}
