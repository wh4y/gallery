import { Gallery } from '../entity/Gallery';
import { Response } from 'express';
import { User } from '../../user/entity/User';

export interface GalleryControllerInterface {
  getGalleryById(id: number): Promise<Gallery>;

  addVideoToGallery(user: User, file: Express.Multer.File): Promise<void>;

  addImageToGallery(user: User, file: Express.Multer.File): Promise<void>;

  downloadFileById(
    galleryId: number,
    fileId: number,
    res: Response,
  ): Promise<void>;
}
