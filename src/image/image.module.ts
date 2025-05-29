import { Module } from '@nestjs/common';

import { ImageController } from '@/image/image.controller';
import { S3Service } from '@/aws/s3.service';

@Module({
  imports: [],
  controllers: [ImageController],
  providers: [S3Service],
  exports: [S3Service]
})
export class ImageModule {}
