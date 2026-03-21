import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureApp(app: INestApplication): void {
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

  const origin = config.get<string>('CORS_ORIGIN');
  if (!origin) {
    throw new Error('CORS_ORIGIN não configurado na variável de ambiente');
  }
  app.enableCors({
    origin,
    credentials: true,
  });
}
