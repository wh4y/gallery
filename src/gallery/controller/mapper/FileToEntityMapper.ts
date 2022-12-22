import { FileTypes, MediaFile } from '../../entity/MediaFile';
import { Injectable } from '@nestjs/common';
import { Gallery } from '../../entity/Gallery';

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
      extension: this.extractExtensionFromFile(file),
      type,
      gallery,
    });

    return mediaFile;
  }

  private extractExtensionFromFile(file: Express.Multer.File): string {
    return file.originalname.replace(/^.+\.(.+)$/, '$1');
  }

  private getPathToStatic(file: Express.Multer.File, type: FileTypes): string {
    const typedFolder = type === FileTypes.IMAGE ? 'images' : 'videos';

    return '/gallery'.concat('/', typedFolder).concat('/', file.filename);
  }
}
