import { MediaFile } from '../entity/MediaFile';

export interface GalleryServiceInterface {
  addFileToGallery(galleryId: number, file: MediaFile): Promise<void>;

  removeFileFromGalleryById(galleryId: number, fileId: number): Promise<void>;

  findAllFilesInGallery(galleryId: number): Promise<MediaFile[]>;
}
