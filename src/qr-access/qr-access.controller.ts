import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { QrAccessService } from '@/qr-access/qr-access.service';

@Controller('qr-access')
export class QrAccessController {
  constructor(private readonly qrAccessService: QrAccessService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  handleQrAccess(@Query('expires') expires?: string, @Query('sig') sig?: string) {
    return this.qrAccessService.validateQrAccessToken(expires, sig);
  }
}
