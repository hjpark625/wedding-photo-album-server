import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadOption } from '@/aws/upload-option';
import { S3Service } from '@/aws/s3.service';

@Controller('image')
export class ImageController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 20, uploadOption))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]): Promise<{ imageUrls: string[] }> {
    const imageUrls = await Promise.all(files.map((file) => this.s3Service.uploadImage(file)));

    return { imageUrls };
  }
}
