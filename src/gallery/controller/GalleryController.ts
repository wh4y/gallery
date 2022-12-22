import { GalleryControllerInterface } from './GalleryControllerInterface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GalleryService } from '../service/GalleryService';
import { Gallery } from '../entity/Gallery';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { FileToEntityMapper } from './mapper/FileToEntityMapper';
import { User } from '../../user/entity/User';
import { AuthedUser } from '../../auth/controller/decorator/AuthedUser';
import { FileTypes, MediaFile } from '../entity/MediaFile';
import { DeleteFilesDto } from './dto/DeleteFilesDto';

@Controller('/gallery')
export class GalleryController implements GalleryControllerInterface {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly fileToEntityMapper: FileToEntityMapper,
  ) {}

  @Get('/:galleryId/all')
  public async getAllFilesFromGallery(
    @Param('galleryId', new ParseIntPipe()) galleryId: number,
    @AuthedUser() invoker: User,
  ): Promise<MediaFile[]> {
    return await this.galleryService.findAllFilesInGalleryById(
      galleryId,
      invoker,
    );
  }

  @Post('/upload-video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/videos',
        filename: (req, file, cb) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + '_' + v4();
          file.filename;
          const extension = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  public async addVideoToGallery(
    @AuthedUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/images',
        filename: (req, file, cb) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + '_' + v4();
          file.filename;
          const extension = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  public async addImageToGallery(
    @AuthedUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const mediaFile = this.fileToEntityMapper.mapFileToEntity(
      file,
      FileTypes.IMAGE,
      user.gallery,
    );

    await this.galleryService.addFileToGallery(user.gallery.id, mediaFile);
  }

  @Get('/:id')
  public async getGalleryInfoById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Gallery> {
    return await this.galleryService.findGalleryById(id, {});
  }

  @Delete('/:galleryId/remove-files')
  public async removeFilesFromGallery(
    @Param('galleryId', new ParseIntPipe()) galleryId: number,
    @Body() dto: DeleteFilesDto,
    @AuthedUser() invoker: User,
  ): Promise<void> {
    await this.galleryService.removeFilesFromGallery(
      galleryId,
      dto.fileIds,
      invoker,
    );
  }
}
