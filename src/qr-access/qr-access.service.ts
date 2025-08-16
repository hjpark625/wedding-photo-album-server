import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { toZonedTime, format } from 'date-fns-tz';

@Injectable()
export class QrAccessService {
  constructor(private readonly configService: ConfigService) {}

  validateQrAccessToken(expires?: string, sig?: string) {
    const secret = this.configService.get<string>('QR_ACCESS_SECRET_KEY');
    const masterExpires = this.configService.get<string>('QR_ACCESS_MASTER_EXPIRES');
    const masterSignature = this.configService.get<string>('QR_ACCESS_MASTER_SIGNATURE');

    if (!secret) {
      throw new InternalServerErrorException('QR_ACCESS_SECRET_KEY가 설정되지 않았습니다.');
    }

    if (!expires || !sig) {
      throw new UnauthorizedException('유효하지 않은 QR 코드입니다.');
    }

    if (expires === masterExpires && sig === masterSignature) {
      return { message: '유효한 마스터 QR 코드입니다.' };
    }

    // 1. 만료 체크
    const now = Date.now();
    if (!expires || now > Number(expires)) {
      throw new ForbiddenException('만료된 QR 코드입니다.');
    }

    // 2. 서명 체크
    const data = `expires=${expires}`;
    const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('hex');

    const zonedTime = toZonedTime(new Date(Number(expires)), 'Asia/Seoul');
    const formattedExpiresTime = format(zonedTime, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Seoul' });

    if (sig !== expectedSig) {
      throw new ForbiddenException('유효하지 않은 QR 코드입니다.');
    }

    return { message: '유효한 QR 코드입니다.', expiresAt: formattedExpiresTime };
  }
}
