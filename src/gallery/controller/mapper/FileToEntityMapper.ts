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
      filePath: file.path,
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
}
