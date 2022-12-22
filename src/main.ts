import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('APP_PORT');

  app.use(cookieParser());

  await app.listen(PORT as number);
}

bootstrap();
