import { GalleryServiceInterface } from './GalleryServiceInterface';
import { Injectable } from '@nestjs/common';
import { MediaFile } from '../entity/MediaFile';
import { Gallery } from '../entity/Gallery';
import { IncludeOptions } from './options';
import { GalleryRepo } from '../repository/GalleryRepo';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaFileRepo } from '../repository/MediaFileRepo';
import { GalleryBlockedUserListRepo } from '../repository/GalleryBlockedUserListRepo';
import { GalleryBlockedUserList } from '../entity/GalleryBlockedUserList';

@Injectable()
export class GalleryService implements GalleryServiceInterface {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepo: GalleryRepo,
    @InjectRepository(MediaFile)
    private readonly mediaFileRepo: MediaFileRepo,
    @InjectRepository(GalleryBlockedUserList)
    private readonly blockedUserListRepo: GalleryBlockedUserListRepo,
  ) {}

  public async findAllFilesInGalleryById(
    galleryId: number,
    invokerId: number,
  ): Promise<MediaFile[]> {
    const gallery = await this.findGalleryById(galleryId, {
      owner: true,
      mediaFiles: true,
    });
    const ownerId = gallery.owner.id;
    if (ownerId === invokerId) return gallery.mediaFiles;

    const isInvokerBlocked = await this.blockedUserListRepo.findOne({
      where: { id: galleryId, blockedUsers: { id: invokerId } },
    });
    if (gallery.isPrivate || isInvokerBlocked)
      throw new Error('Access denied!');

    const accessibleMediaFiles = gallery.mediaFiles;

    return accessibleMediaFiles;
  }

  public async findGalleryById(
    galleryId: number,
    includeOptions: IncludeOptions,
  ): Promise<Gallery> {
    const gallery = await this.galleryRepo.findOne({
      where: { id: galleryId },
      relations: includeOptions,
    });
    if (!gallery) throw new Error();

    return gallery;
  }

  public async addFileToGallery(
    galleryId: number,
    file: MediaFile,
  ): Promise<void> {
    const gallery = await this.galleryRepo.findOne({
      where: { id: galleryId },
      relations: {
        mediaFiles: true,
      },
    });
    if (!gallery) throw new Error();

    gallery.mediaFiles.push(file);

    await this.galleryRepo.save(gallery);
  }

  public async removeFileFromGalleryById(
    galleryId: number,
    fileId: number,
  ): Promise<void> {
    let gallery = await this.galleryRepo.findOne({
      where: { id: galleryId },
      relations: {
        mediaFiles: true,
      },
    });
    if (!gallery) throw new Error();

    gallery = gallery.withMediaFiles(
      gallery.mediaFiles.filter(file => file.id !== fileId),
    );

    await this.galleryRepo.save(gallery);
  }
}
