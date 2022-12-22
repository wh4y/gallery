import { MediaFile } from '../entity/MediaFile';
import { Gallery } from '../entity/Gallery';
import { IncludeOptions } from './options';

export interface GalleryServiceInterface {
  addFileToGallery(galleryId: number, file: MediaFile): Promise<void>;

  removeFileFromGalleryById(galleryId: number, fileId: number): Promise<void>;

  findGalleryById(galleryId: number, include: IncludeOptions): Promise<Gallery>;

  findAllFilesInGalleryById(
    galleryId: number,
    invokerId: number,
  ): Promise<MediaFile[]>;
}
