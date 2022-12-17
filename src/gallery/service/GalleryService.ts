import { GalleryServiceInterface } from './GalleryServiceInterface';
import { Inject, Injectable } from '@nestjs/common';
import { MediaFile } from '../entity/MediaFile';
import { GalleryRepoInterface } from '../repository/GalleryRepoInterface';
import { GALLERY_REPO } from '../repository/GalleryRepoProvider';

@Injectable()
export class GalleryService implements GalleryServiceInterface {
  constructor(
    @Inject(GALLERY_REPO)
    private readonly galleryRepo: GalleryRepoInterface,
  ) {}

  public async addFileToGallery(
    galleryId: number,
    file: MediaFile,
  ): Promise<void> {
    const gallery = await this.galleryRepo.findById(galleryId);
    gallery.mediaFiles.push(file);

    await this.galleryRepo.save(gallery);
  }

  public async findAllFilesInGallery(galleryId: number): Promise<MediaFile[]> {
    return (await this.galleryRepo.findById(galleryId)).mediaFiles;
  }

  public async removeFileFromGalleryById(
    galleryId: number,
    fileId: number,
  ): Promise<void> {
    const gallery = await this.galleryRepo.findById(galleryId);
    gallery.mediaFiles = gallery.mediaFiles.filter(file => file.id !== fileId);

    await this.galleryRepo.save(gallery);
  }
}
