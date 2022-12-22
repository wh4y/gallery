import { MediaFile } from '../entity/MediaFile';
import { Gallery } from '../entity/Gallery';
import { IncludeOptions } from './options';
import { User } from '../../user/entity/User';

export interface GalleryServiceInterface {
  addFileToGallery(galleryId: number, file: MediaFile): Promise<void>;

  removeFilesFromGallery(galleryId: number, fileIds: number[]): Promise<void>;

  findGalleryById(galleryId: number, include: IncludeOptions): Promise<Gallery>;

  findAllFilesInGalleryById(
    galleryId: number,
    invoker: User,
  ): Promise<MediaFile[]>;
}
