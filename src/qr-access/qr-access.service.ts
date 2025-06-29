import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class QrAccessService {
  constructor(private readonly configService: ConfigService) {}

  validateQrAccessToken(expires?: string, sig?: string) {
    const secret = this.configService.get<string>('QR_ACCESS_SECRET_KEY');

    console.log(secret);

    if (!secret) {
      throw new InternalServerErrorException('QR_ACCESS_SECRET_KEY가 설정되지 않았습니다.');
    }

    if (!expires || !sig) {
      throw new UnauthorizedException('유효하지 않은 QR 코드입니다.');
    }

    // 1. 만료 체크
    const now = Date.now();
    if (!expires || now > Number(expires)) {
      throw new ForbiddenException('만료된 QR 코드입니다.');
    }

    // 2. 서명 체크
    const data = `expires=${expires}`;
    const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('hex');

    if (sig !== expectedSig) {
      throw new ForbiddenException('유효하지 않은 QR 코드입니다.');
    }

    return { message: '유효한 QR 코드입니다.' };
  }
}
