import { GalleryServiceInterface } from './GalleryServiceInterface';
import { Injectable } from '@nestjs/common';
import { MediaFile } from '../entity/MediaFile';
import { Gallery } from '../entity/Gallery';
import { EditGalleryParamsOptions, IncludeOptions } from './types';
import { GalleryRepo } from '../repository/GalleryRepo';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaFileRepo } from '../repository/MediaFileRepo';
import { GalleryBlockedUserListRepo } from '../repository/GalleryBlockedUserListRepo';
import { GalleryBlockedUserList } from '../entity/GalleryBlockedUserList';
import { User } from '../../user/entity/User';
import { Roles } from '../../user/core/Roles';
import * as fs from 'fs/promises';
import * as path from 'path';
import { In } from 'typeorm';
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
      mediaFiles: true,
    });

    const isInvokerOwner = gallery.owner.id === invoker.id;
    const isInvokerAdmin = invoker.roles.some(
      role => role.name === Roles.ADMIN,
    );

    if (isInvokerOwner || isInvokerAdmin) return gallery.mediaFiles;

    const isInvokerBlocked = await this.galleryBlockedUserListRepo.findOne({
      where: { id: galleryId, blockedUsers: { id: invoker.id } },
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
      relations: {
        ...includeOptions,
        owner: {
          roles: true,
        },
      },
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

  public async removeFilesFromGallery(
    galleryId: number,
    fileIds: number[],
    invoker: User,
  ): Promise<void> {
    const gallery = await this.findGalleryById(galleryId, { owner: true });

    const isInvokerOwner = gallery.owner.id === invoker.id;
    const isInvokerAdmin = invoker.roles.some(
      role => role.name === Roles.ADMIN,
    );

    if (!isInvokerAdmin && !isInvokerOwner) throw new Error('Access denied');

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

    const isInvokerOwner = gallery.owner.id === invoker.id;
    const isInvokerAdmin = invoker.roles.some(
      role => role.name === Roles.ADMIN,
    );

    if (!isInvokerAdmin && !isInvokerOwner) throw new Error('Access denied');

    await this.galleryRepo.update({ id: galleryId }, options);
  }

  public async forbidFileViewingForUser(
    fileId: number,
    userId: number,
    invoker: User,
  ): Promise<void> {
    const file = await this.mediaFileRepo.findOne({
      where: { id: fileId },
      relations: { gallery: true, blockedUserList: true },
    });
    if (!file) throw new Error("File doesn't exist!");

    const isInvokerOwner = file.gallery.owner.id === invoker.id;
    const isInvokerAdmin = invoker.roles.some(
      role => role.name === Roles.ADMIN,
    );

    if (!isInvokerAdmin && !isInvokerOwner) throw new Error('Access denied');

    const userToBeBlocked = await this.userService.findUserById(userId);

    await this.fileBlockedUserListRepo
      .createQueryBuilder()
      .relation('blockedUsers')
      .of(file.blockedUserList)
      .add(userToBeBlocked);
  }
}
