import { GalleryServiceInterface } from './GalleryServiceInterface';
import { Injectable } from '@nestjs/common';
import { MediaFile } from '../entity/MediaFile';
import { Gallery } from '../entity/Gallery';
import { EditGalleryParamsOptions } from './types';
import { GalleryRepo } from '../repository/GalleryRepo';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaFileRepo } from '../repository/MediaFileRepo';
import { GalleryBlockedUserListRepo } from '../repository/GalleryBlockedUserListRepo';
import { GalleryBlockedUserList } from '../entity/GalleryBlockedUserList';
import { User } from '../../user/entity/User';
import { Roles } from '../../user/core/Roles';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FindOptionsRelations, In } from 'typeorm';
import { FileBlockedUserList } from '../entity/FileBlockedUserList';
import { FileBlockedUserListRepo } from '../repository/FileBlockedUserListRepo';
import { UserService } from '../../user/service/UserService';

@Injectable()
export class GalleryService implements GalleryServiceInterface {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepo: GalleryRepo,
    @InjectRepository(MediaFile)
    private readonly mediaFileRepo: MediaFileRepo,
    @InjectRepository(GalleryBlockedUserList)
    private readonly galleryBlockedUserListRepo: GalleryBlockedUserListRepo,
    @InjectRepository(FileBlockedUserList)
    private readonly fileBlockedUserListRepo: FileBlockedUserListRepo,
    private readonly userService: UserService,
  ) {}

  public async findAllFilesInGalleryById(
    galleryId: number,
    invoker: User,
  ): Promise<MediaFile[]> {
    const gallery = await this.findGalleryById(galleryId, {
      owner: true,
      mediaFiles: {
        blockedUserList: { blockedUsers: true },
      },
    });

    const doesUserHaveAccess = this.doesUserHaveAccessToGallery(
      gallery,
      invoker,
    );
    if (doesUserHaveAccess) return gallery.mediaFiles;

    const isInvokerBlocked = await this.galleryBlockedUserListRepo.findOne({
      where: { id: galleryId, blockedUsers: { id: invoker.id } },
    });
    if (gallery.isPrivate || isInvokerBlocked)
      throw new Error('Access denied!');

    const accessibleMediaFiles = gallery.mediaFiles.filter(
      file =>
        !file.blockedUserList.blockedUsers.some(
          blockerUser => blockerUser.id === invoker.id,
        ),
    );

    return accessibleMediaFiles;
  }

  public async findGalleryById(
    galleryId: number,
    includeOptions?: FindOptionsRelations<Gallery>,
  ): Promise<Gallery> {
    const gallery = await this.galleryRepo.findOne({
      where: { id: galleryId },
      relations: {
        ...includeOptions,
        owner: {
          roles: true,
        },
      },
    });
    if (!gallery) throw new Error("Gallery doesn't exist!");

    return gallery;
  }

  public async addFileToGallery(
    galleryId: number,
    file: MediaFile,
  ): Promise<void> {
    const gallery = await this.findGalleryById(galleryId, { mediaFiles: true });

    gallery.mediaFiles.push(
      MediaFile.createOneWith({
        ...file,
        blockedUserList: FileBlockedUserList.createOneWith({}),
      }),
    );

    await this.galleryRepo.save(gallery);
  }

  public async removeFilesFromGallery(
    galleryId: number,
    fileIds: number[],
    invoker: User,
  ): Promise<void> {
    const gallery = await this.findGalleryById(galleryId, { owner: true });

    const doesUserHaveAccess = this.doesUserHaveAccessToGallery(
      gallery,
      invoker,
    );
    if (!doesUserHaveAccess) throw new Error('Access denied');

    const filesToDelete = await this.mediaFileRepo.find({
      where: { id: In(fileIds) },
      select: {
        id: true,
        destination: true,
        localFileName: true,
      },
    });

    await this.mediaFileRepo.remove(filesToDelete);

    for (const file of filesToDelete) {
      await fs.unlink(
        path.join('./', file.destination.slice(1), file.localFileName),
      );
    }
  }

  public async editGalleryParams(
    galleryId: number,
    options: EditGalleryParamsOptions,
    invoker: User,
  ): Promise<void> {
    const gallery = await this.findGalleryById(galleryId, { owner: true });

    const doesUserHaveAccess = this.doesUserHaveAccessToGallery(
      gallery,
      invoker,
    );
    if (!doesUserHaveAccess) throw new Error('Access denied');

    await this.galleryRepo.update({ id: galleryId }, options);
  }

  public async forbidFileViewingForUser(
    fileId: number,
    userId: number,
    invoker: User,
  ): Promise<void> {
    const file = await this.mediaFileRepo.findOne({
      where: { id: fileId },
      relations: { gallery: { owner: true }, blockedUserList: true },
    });
    if (!file) throw new Error("File doesn't exist!");

    const doesUserHaveAccess = this.doesUserHaveAccessToGallery(
      file.gallery,
      invoker,
    );
    if (!doesUserHaveAccess) throw new Error('Access denied');

    const userToBeBlocked = await this.userService.findUserById(userId);

    await this.fileBlockedUserListRepo
      .createQueryBuilder()
      .relation('blockedUsers')
      .of(file.blockedUserList)
      .add(userToBeBlocked);
  }

  async allowFileViewingForUser(
    fileId: number,
    userId: number,
    invoker: User,
  ): Promise<void> {
    const file = await this.mediaFileRepo.findOne({
      where: { id: fileId },
      relations: { gallery: { owner: true }, blockedUserList: true },
    });
    if (!file) throw new Error("File doesn't exist!");

    const doesUserHaveAccess = this.doesUserHaveAccessToGallery(
      file.gallery,
      invoker,
    );
    if (!doesUserHaveAccess) throw new Error('Access denied');

    const userToBeAllowedToView = await this.userService.findUserById(userId);

    await this.fileBlockedUserListRepo
      .createQueryBuilder()
      .relation('blockedUsers')
      .of(file.blockedUserList)
      .remove(userToBeAllowedToView);
  }

  public async forbidGalleryViewingForUser(
    galleryId: number,
    userId: number,
    invoker: User,
  ): Promise<void> {
    const gallery = await this.findGalleryById(galleryId, {
      blockedUserList: { blockedUsers: true },
    });

    const doesUserHaveAccess = this.doesUserHaveAccessToGallery(
      gallery,
      invoker,
    );
    if (!doesUserHaveAccess) throw new Error('Access denied');

    const userToBeBlocked = await this.userService.findUserById(userId);

    await this.galleryBlockedUserListRepo
      .createQueryBuilder()
      .relation('blockedUsers')
      .of(gallery.blockedUserList)
      .add(userToBeBlocked);
  }

  private doesUserHaveAccessToGallery(gallery: Gallery, user: User): boolean {
    const isInvokerOwner = gallery.owner.id === user.id;
    const isInvokerAdmin = user.roles.some(role => role.name === Roles.ADMIN);

    return isInvokerAdmin || isInvokerOwner;
  }

  public async allowGalleryViewingForUser(
    galleryId: number,
    userId: number,
    invoker: User,
  ): Promise<void> {
    const gallery = await this.findGalleryById(galleryId, {
      blockedUserList: { blockedUsers: true },
    });

    const doesUserHaveAccess = this.doesUserHaveAccessToGallery(
      gallery,
      invoker,
    );
    if (!doesUserHaveAccess) throw new Error('Access denied');

    const userToBeAllowedToView = await this.userService.findUserById(userId);

    await this.galleryBlockedUserListRepo
      .createQueryBuilder()
      .relation('blockedUsers')
      .of(gallery.blockedUserList)
      .remove(userToBeAllowedToView);
  }
}
