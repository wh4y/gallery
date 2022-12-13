import { GalleryServiceInterface } from './GalleryServiceInterface';
import { Injectable } from '@nestjs/common';
import { MediaFile } from '../entity/MediaFile';
import { GalleryRepoInterface } from '../repository/GalleryRepoInterface';

@Injectable()
export class GalleryService implements GalleryServiceInterface {
  constructor(private readonly galleryRepo: GalleryRepoInterface) {}

  public async addFileToGallery(
    galleryId: number,
    file: MediaFile,
  ): Promise<void> {
    const gallery = await this.galleryRepo.findGalleryById(galleryId);
    gallery.mediaFiles.push(file);

    await this.galleryRepo.saveGallery(gallery);
  }

  public async findAllFilesInGallery(galleryId: number): Promise<MediaFile[]> {
    return (await this.galleryRepo.findGalleryById(galleryId)).mediaFiles;
  }

  public async removeFileFromGalleryById(
    galleryId: number,
    fileId: number,
  ): Promise<void> {
    const gallery = await this.galleryRepo.findGalleryById(galleryId);
    gallery.mediaFiles = gallery.mediaFiles.filter(file => file.id !== fileId);

    await this.galleryRepo.saveGallery(gallery);
  }
}
