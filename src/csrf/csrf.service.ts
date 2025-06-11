import { csrfMiddleware } from '@/middleware/csrf.middleware';
import { Injectable } from '@nestjs/common';

import type { Request, Response } from 'express';

@Injectable()
export class CsrfService {
  onIssueCsrfToken(req: Request, res: Response) {
    const token = csrfMiddleware.generateCsrfToken(req, res);
    return res.json({ csrfToken: token });
  }
}
