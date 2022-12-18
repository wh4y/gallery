import { GalleryServiceInterface } from './GalleryServiceInterface';
import { Injectable } from '@nestjs/common';
import { MediaFile } from '../entity/MediaFile';
import { Gallery } from '../entity/Gallery';
import { IncludeOptions } from './options';
import { GalleryRepo } from '../repository/GalleryRepo';

@Injectable()
export class GalleryService implements GalleryServiceInterface {
  constructor(private readonly galleryRepo: GalleryRepo) {}

  public async findGalleryById(
    galleryId: number,
    includeOptions: IncludeOptions,
  ): Promise<Gallery> {
    const gallery = await this.galleryRepo.findOne({
      where: { id: galleryId },
      relations: includeOptions,
    });
    if (!gallery) throw new Error();

    return gallery;
  }

  public async addFileToGallery(
    galleryId: number,
    file: MediaFile,
  ): Promise<void> {
    const gallery = await this.galleryRepo.findOne({
      where: { id: galleryId },
      relations: {
        mediaFiles: true,
      },
    });
    if (!gallery) throw new Error();

    gallery.mediaFiles.push(file);

    await this.galleryRepo.save(gallery);
  }

  public async removeFileFromGalleryById(
    galleryId: number,
    fileId: number,
  ): Promise<void> {
    let gallery = await this.galleryRepo.findOne({
      where: { id: galleryId },
      relations: {
        mediaFiles: true,
      },
    });
    if (!gallery) throw new Error();

    gallery = gallery.withMediaFiles(
      gallery.mediaFiles.filter(file => file.id !== fileId),
    );

    await this.galleryRepo.save(gallery);
  }
}
