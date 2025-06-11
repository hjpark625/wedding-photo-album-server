import { Module } from '@nestjs/common';

import { CsrfController } from '@/csrf/csrf.controller';
import { CsrfService } from '@/csrf/csrf.service';

@Module({
  controllers: [CsrfController],
  providers: [CsrfService]
})
export class CsrfModule {}
