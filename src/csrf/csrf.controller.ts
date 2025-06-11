import { Controller, Get, Req, Res } from '@nestjs/common';

import { CsrfService } from '@/csrf/csrf.service';

import type { Request, Response } from 'express';

@Controller('csrf')
export class CsrfController {
  constructor(private csrfService: CsrfService) {}

  @Get('token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    return this.csrfService.onIssueCsrfToken(req, res);
  }
}
