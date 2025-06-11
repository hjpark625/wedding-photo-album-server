import { doubleCsrf } from 'csrf-csrf';

import type { DoubleCsrfConfigOptions } from 'csrf-csrf';

function csrfMiddleware({ domain, nodeEnv, secretKey }: { secretKey: string; domain: string; nodeEnv: string }) {
  const csrfConfig: DoubleCsrfConfigOptions = {
    getSecret: () => secretKey || 'default',
    getSessionIdentifier: (req) => {
      return typeof req.cookies['connect.sid'] === 'string' ? req.cookies['connect.sid'] : '';
    },
    getCsrfTokenFromRequest: (req) => {
      return typeof req.headers['x-csrf-token'] === 'string' ? req.headers['x-csrf-token'] : '';
    },
    cookieName: 'x-csrf-token',
    cookieOptions: {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: nodeEnv === 'production' ? 'none' : 'strict',
      domain: nodeEnv === 'production' ? domain : undefined,
      maxAge: 1000 * 60 * 60 * 12
    },
    errorConfig: {
      statusCode: 403,
      message: '유효하지않은 CSRF 토큰입니다.'
    },
    skipCsrfProtection: (req) => req.path.startsWith('/health')
  };

  return doubleCsrf(csrfConfig);
}

export { csrfMiddleware };
