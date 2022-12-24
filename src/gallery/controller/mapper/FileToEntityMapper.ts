import { MediaFile } from '../../entity/MediaFile';
import { Injectable } from '@nestjs/common';
import { Gallery } from '../../entity/Gallery';
import { extractExtFromFileName } from '../../../common/file/util/extractExtFromFileName';
import { FileTypes } from '../../core/FileTypes';

@Injectable()
export class FileToEntityMapper {
  public mapFileToEntity(
    file: Express.Multer.File,
    type: FileTypes,
    gallery: Gallery,
  ): MediaFile {
    const mediaFile = MediaFile.createOneWith({
      path: this.getPathToStatic(file, type),
      publicFileName: file.originalname.replace(/^(.+)\..+$/, '$1'),
      localFileName: file.filename,
      destination: file.destination,
      extension: extractExtFromFileName(file.filename),
      type,
      gallery,
    });

    return mediaFile;
  }

  private getPathToStatic(file: Express.Multer.File, type: FileTypes): string {
    const typedFolder = type === FileTypes.IMAGE ? 'images' : 'videos';

    return '/gallery'.concat('/', typedFolder).concat('/', file.filename);
  }
}
