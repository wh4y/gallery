import { MediaFile } from '../entity/MediaFile';
import { Gallery } from '../entity/Gallery';
import { EditGalleryParamsOptions } from './types';
import { User } from '../../user/entity/User';
import { FindOptionsRelations } from 'typeorm';

export interface GalleryServiceInterface {
  addFileToGallery(galleryId: number, file: MediaFile): Promise<void>;

  removeFilesFromGallery(
    galleryId: number,
    fileIds: number[],
    invoker: User,
  ): Promise<void>;

  findGalleryById(
    galleryId: number,
    include?: FindOptionsRelations<Gallery>,
  ): Promise<Gallery>;

  editGalleryParams(
    galleryId: number,
    options: EditGalleryParamsOptions,
    invoker: User,
  ): Promise<void>;

  findAllFilesInGalleryById(
    galleryId: number,
    invoker: User,
  ): Promise<MediaFile[]>;

  forbidFileViewingForUser(
    fileId: number,
    userId: number,
    invoker: User,
  ): Promise<void>;

  forbidGalleryViewingForUser(
    galleryId: number,
    userId: number,
    invoker: User,
  ): Promise<void>;

  allowGalleryViewingForUser(
    galleryId: number,
    userId: number,
    invoker: User,
  ): Promise<void>;
}
