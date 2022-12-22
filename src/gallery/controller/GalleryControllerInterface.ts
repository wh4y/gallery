import { Gallery } from '../entity/Gallery';
import { User } from '../../user/entity/User';
import { MediaFile } from '../entity/MediaFile';
import { DeleteFilesDto } from './dto/DeleteFilesDto';
import { Request, Response } from 'express';

export interface GalleryControllerInterface {
  getGalleryInfoById(id: number): Promise<Gallery>;

  getVideoStream(
    localFileName: string,
    invoker: User,
    req: Request,
    res: Response,
  ): Promise<void>;

  addVideoToGallery(user: User, file: Express.Multer.File): Promise<void>;

  addImageToGallery(user: User, file: Express.Multer.File): Promise<void>;

  getAllFilesFromGallery(
    galleryId: number,
    invoker: User,
  ): Promise<MediaFile[]>;

  removeFilesFromGallery(
    galleryId: number,
    dto: DeleteFilesDto,
    invoker: User,
  ): Promise<void>;
}
