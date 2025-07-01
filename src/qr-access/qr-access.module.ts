import { Module } from '@nestjs/common';

import { QrAccessController } from '@/qr-access/qr-access.controller';
import { QrAccessService } from '@/qr-access/qr-access.service';

@Module({
  providers: [QrAccessService],
  controllers: [QrAccessController]
})
export class QrAccessModule {}
