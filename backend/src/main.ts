import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const origin = config.get<string>('CORS_ORIGIN') ?? 'http://localhost:4200';
  app.enableCors({
    origin,
    credentials: true,
  });

  const port = Number(config.get('PORT') ?? 3000);
  await app.listen(port);
}

void bootstrap();
