import { doubleCsrf } from 'csrf-csrf';

const csrfMiddleware = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET_KEY || 'default',
  getSessionIdentifier: (req) => {
    return typeof req.cookies['connect.sid'] === 'string' ? req.cookies['connect.sid'] : '';
  },
  getCsrfTokenFromRequest: (req) => {
    console.log(req.headers);
    return typeof req.headers['x-csrf-token'] === 'string' ? req.headers['x-csrf-token'] : '';
  },
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 12 // 12 hours
  },
  errorConfig: {
    statusCode: 403,
    message: '유효하지않은 CSRF 토큰입니다.'
  },
  skipCsrfProtection: (req) => req.path.startsWith('/health')
});

export { csrfMiddleware };
