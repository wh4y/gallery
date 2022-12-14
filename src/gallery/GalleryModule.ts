import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './entity/Gallery';
import { MediaFile } from './entity/MediaFile';
import { GalleryService } from './service/GalleryService';
import { GalleryRepoProvider } from './repository/GalleryRepoProvider';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, MediaFile])],
  providers: [GalleryRepoProvider, GalleryService],
})
export class GalleryModule {}
