import { Gallery } from '../entity/Gallery';
import { MediaFile } from '../entity/MediaFile';
import { Response } from 'express';

export interface GalleryControllerInterface {
  getGalleryById(id: number): Promise<Gallery>;
  addFileToGalleryWithId(id: number, file: unknown): Promise<void>;
  addFileToGalleryWithId(id: number, mediaFile: MediaFile): Promise<void>;
  downloadFileById(
    galleryId: number,
    fileId: number,
    res: Response,
  ): Promise<void>;
}
