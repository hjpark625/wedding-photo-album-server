import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { csrfMiddleware } from '@/middleware/csrf.middleware';
import { AppModule } from '@/app.module';

async function bootstrap() {
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

  console.info(`NestJS application is starting... in port: ${PORT}`);
  await app.listen(PORT);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
