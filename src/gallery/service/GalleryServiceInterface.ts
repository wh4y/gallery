import { MediaFile } from '../entity/MediaFile';
import { Gallery } from '../entity/Gallery';
import { EditGalleryParamsOptions, IncludeOptions } from './types';
import { User } from '../../user/entity/User';

export interface GalleryServiceInterface {
  addFileToGallery(galleryId: number, file: MediaFile): Promise<void>;

  removeFilesFromGallery(
    galleryId: number,
    fileIds: number[],
    invoker: User,
  ): Promise<void>;

  findGalleryById(galleryId: number, include: IncludeOptions): Promise<Gallery>;

  editGalleryParams(
    galleryId: number,
    options: EditGalleryParamsOptions,
    invoker: User,
  ): Promise<void>;

  findAllFilesInGalleryById(
    galleryId: number,
    invoker: User,
  ): Promise<MediaFile[]>;
}
