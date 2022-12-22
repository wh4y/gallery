import { Gallery } from '../entity/Gallery';
import { User } from '../../user/entity/User';
import { MediaFile } from '../entity/MediaFile';

export interface GalleryControllerInterface {
  getGalleryInfoById(id: number): Promise<Gallery>;

  addVideoToGallery(user: User, file: Express.Multer.File): Promise<void>;

  addImageToGallery(user: User, file: Express.Multer.File): Promise<void>;

  getAllFilesFromGallery(
    galleryId: number,
    invoker: User,
  ): Promise<MediaFile[]>;
}
