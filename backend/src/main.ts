import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:'http://localhost:3001',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: 'GET,PUT,POST,DELETE,HEAD,PATCH,OPTIONS'
  });

  await app.listen(3000);
}
bootstrap();
