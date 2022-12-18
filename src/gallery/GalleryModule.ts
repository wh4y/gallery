import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './entity/Gallery';
import { MediaFile } from './entity/MediaFile';
import { GalleryService } from './service/GalleryService';
import { GalleryController } from './controller/GalleryController';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, MediaFile])],
  providers: [GalleryService],
  controllers: [GalleryController],
})
export class GalleryModule {}
