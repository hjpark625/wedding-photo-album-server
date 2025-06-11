import { csrfMiddleware } from '@/middleware/csrf.middleware';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { DoubleCsrfUtilities } from 'csrf-csrf';
import type { Request, Response } from 'express';

@Injectable()
export class CsrfService {
  private csrfMiddlewareInstance: DoubleCsrfUtilities;

  constructor(private configService: ConfigService) {
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    const domain = this.configService.get<string>('MAIN_DOMAIN') || 'localhost';
    const secretKey = this.configService.get<string>('CSRF_SECRET_KEY') || 'default';

    this.csrfMiddlewareInstance = csrfMiddleware({ nodeEnv, domain, secretKey });
  }

  onIssueCsrfToken(req: Request, res: Response) {
    const token = this.csrfMiddlewareInstance.generateCsrfToken(req, res);
    return res.json({ csrfToken: token });
  }
}
