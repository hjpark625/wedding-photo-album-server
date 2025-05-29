import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

import type { Options, FileFilterCallback } from 'multer';
import type { Request } from 'express';

export const uploadOption: Options = {
  storage: memoryStorage(),
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('이미지 파일만 업로드 가능합니다.'));
    }
  },
  limits: {
    fileSize: 150 * 1024 * 1024 // 150mb 한정
  }
};
