import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { csrfMiddleware } from '@/middleware/csrf.middleware';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  console.info(`NestJS application is starting... in port: ${PORT}`);

  app.use(cookieParser());
  app.use(csrfMiddleware.doubleCsrfProtection);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  });

  await app.listen(PORT);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
