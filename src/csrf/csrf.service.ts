import { csrfMiddleware } from '@/middleware/csrf.middleware';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Request, Response } from 'express';

@Injectable()
export class CsrfService {
  constructor(private configService: ConfigService) {}

  onIssueCsrfToken(req: Request, res: Response) {
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    const domain = this.configService.get<string>('MAIN_DOMAIN') || 'localhost';
    const secretKey = this.configService.get<string>('CSRF_SECRET_KEY') || 'default';

    const token = csrfMiddleware({ nodeEnv, domain, secretKey }).generateCsrfToken(req, res);
    return res.json({ csrfToken: token });
  }
}
