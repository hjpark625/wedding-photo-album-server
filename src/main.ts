import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { toZonedTime, format } from 'date-fns-tz';

import { csrfMiddleware } from '@/middleware/csrf.middleware';
import { AppModule } from '@/app.module';

async function bootstrap() {
  // 런타임 한국 시간대 설정
  process.env.TZ = 'Asia/Seoul';

  // date-fns-tz 한국 시간대 설정
  const koreaTimeZone = 'Asia/Seoul';

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const domain = process.env.MAIN_DOMAIN || 'localhost';
  const secretKey = process.env.CSRF_SECRET_KEY || 'default';

  app.use(cookieParser());
  app.use(csrfMiddleware({ nodeEnv, domain, secretKey }).doubleCsrfProtection);

  app.enableCors({
    origin: [process.env.CORS_ORIGIN, 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });

  // 한국 시간으로 서버 시작 시간 표시
  const now = new Date();
  const koreaTime = toZonedTime(now, koreaTimeZone);
  const formattedTime = format(koreaTime, 'yyyy-MM-dd HH:mm:ss zzz', { timeZone: koreaTimeZone });

  console.info(`NestJS application is starting... in port: ${PORT} at ${formattedTime}`);
  await app.listen(PORT);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
