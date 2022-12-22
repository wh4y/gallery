import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GalleryModule } from './gallery/GalleryModule';
import { join } from 'path';
import { AuthModule } from './auth/AuthModule';
import { AuthMiddleware } from './auth/middleware/AuthMiddleware';
import { GalleryController } from './gallery/controller/GalleryController';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get<string>('DB_DIALECT'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          logging: true,
          migrationsRun: true,
          entities: [join(__dirname, '**', 'entity', '*.{ts,js}')],
          migrations: [
            join(__dirname, 'typeorm', 'migrations', '**', '*{.ts, .js}'),
          ],
        } as TypeOrmModuleOptions),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'upload', 'images'),
      serveRoot: '/gallery/images/',
      serveStaticOptions: {
        index: false,
      },
    }),
    GalleryModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(GalleryController);
  }
}
