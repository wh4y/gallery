import { GalleryControllerInterface } from './GalleryControllerInterface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GalleryService } from '../service/GalleryService';
import { Gallery } from '../entity/Gallery';
import { FileToEntityMapper } from './mapper/FileToEntityMapper';
import { User } from '../../user/entity/User';
import { AuthedUser } from '../../auth/controller/decorator/AuthedUser';
import { DeleteFilesDto } from './dto/DeleteFilesDto';
import { extractExtFromFileName } from '../../common/file/util/extractExtFromFileName';
import { createReadStream } from 'fs';
import { stat as fs_stat } from 'fs/promises';
import { EditGalleryParamsDto } from './dto/EditGalleryParamsDto';
import { FileInterceptor } from './interceptor/FileInterceptor';
import { MediaFile } from '../entity/MediaFile';
import { FileTypes } from '../core/FileTypes';

@Controller('/gallery')
export class GalleryController implements GalleryControllerInterface {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly fileToEntityMapper: FileToEntityMapper,
  ) {}

  @Header('Accept-Ranges', 'bytes')
  @Get('/videos/:localFileName')
  public async getVideoStream(
    @Param('localFileName') localFileName: string,
    @AuthedUser() invoker: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const path = './upload/videos/' + localFileName;
    const stat = await fs_stat(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    const contentType = 'video/' + extractExtFromFileName(localFileName);
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = createReadStream(path, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
      };
      res.writeHead(200, head);
      createReadStream(path).pipe(res);
    }
  }

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
  @UseInterceptors(FileInterceptor(FileTypes.VIDEO, 'file'))
  public async addVideoToGallery(
    @AuthedUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const mediaFile = this.fileToEntityMapper.mapFileToEntity(
      file,
      FileTypes.VIDEO,
      user.gallery,
    );

    await this.galleryService.addFileToGallery(user.gallery.id, mediaFile);
  }

  @Post('/upload-image')
  @UseInterceptors(FileInterceptor(FileTypes.IMAGE, 'file'))
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

  @Patch('/:galleryId/edit-params')
  async editGalleryParams(
    @Param('galleryId', new ParseIntPipe()) galleryId: number,
    @Body() dto: EditGalleryParamsDto,
    @AuthedUser() invoker: User,
  ): Promise<void> {
    await this.galleryService.editGalleryParams(galleryId, dto, invoker);
  }

  @Post('/forbid-file-viewing/:fileId/for/:userId')
  async forbidFileViewingForUser(
    @Param('fileId', new ParseIntPipe()) fileId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
    @AuthedUser() invoker: User,
  ): Promise<void> {
    await this.galleryService.forbidFileViewingForUser(fileId, userId, invoker);
  }

  @Post('/forbid-gallery-viewing/:galleryId/for/:userId')
  async forbidGalleryViewingForUser(
    @Param('galleryId', new ParseIntPipe()) galleryId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
    @AuthedUser() invoker: User,
  ): Promise<void> {
    await this.galleryService.forbidGalleryViewingForUser(
      galleryId,
      userId,
      invoker,
    );
  }

  @Post('/allow-gallery-viewing/:galleryId/for/:userId')
  public async allowGalleryViewingForUser(
    @Param('galleryId', new ParseIntPipe()) galleryId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
    @AuthedUser() invoker: User,
  ): Promise<void> {
    await this.galleryService.allowGalleryViewingForUser(
      galleryId,
      userId,
      invoker,
    );
  }
}
