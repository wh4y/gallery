import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './entity/Gallery';
import { MediaFile } from './entity/MediaFile';
import { GalleryService } from './service/GalleryService';
import { GalleryController } from './controller/GalleryController';
import { FileToEntityMapper } from './controller/mapper/FileToEntityMapper';
import { GalleryBlockedUserList } from './entity/GalleryBlockedUserList';
import { UserModule } from '../user/UserModule';
import { FileBlockedUserList } from './entity/FileBlockedUserList';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Gallery,
      MediaFile,
      GalleryBlockedUserList,
      FileBlockedUserList,
    ]),
    UserModule,
  ],
  providers: [GalleryService, FileToEntityMapper],
  controllers: [GalleryController],
})
export class GalleryModule {}
