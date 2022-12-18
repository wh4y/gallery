import { GalleryControllerInterface } from './GalleryControllerInterface';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GalleryService } from '../service/GalleryService';
import { Gallery } from '../entity/Gallery';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaFile } from '../entity/MediaFile';
import { TransformFileToEntityPipe } from './pipe/TranfromFileToDtoPipe';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { Response } from 'express';

@Controller('/gallery')
export class GalleryController implements GalleryControllerInterface {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('upload-file/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
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
  public async addFileToGalleryWithId(
    @Param('id', new ParseIntPipe()) id: number,
    @UploadedFile(new TransformFileToEntityPipe()) mediaFile: MediaFile,
  ): Promise<void> {
    await this.galleryService.addFileToGallery(id, mediaFile);
  }

  @Get('/:id')
  public async getGalleryById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Gallery> {
    return await this.galleryService.findGalleryById(id, { mediaFiles: true });
  }

  @Get('/:galleryId/download-file/:fileId')
  public async downloadFileById(
    @Param('galleryId', new ParseIntPipe()) galleryId: number,
    @Param('fileId', new ParseIntPipe()) fileId: number,
    @Res() res: Response,
  ): Promise<void> {
    const { filePath } = await this.galleryService.findFileInGalleryById(
      galleryId,
      fileId,
    );

    res.sendFile(filePath, {
      root: './',
    });
  }
}
