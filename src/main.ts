import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('APP_PORT');

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', '..', 'upload'), {
    index: false,
    prefix: '/gallery/',
  });

  await app.listen(PORT as number);
}

bootstrap();
