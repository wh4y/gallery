import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { MediaFile } from '../../entity/MediaFile';

@Injectable()
export class TransformFileToEntityPipe implements PipeTransform {
  public transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    const mediaFile: MediaFile = MediaFile.createOneWith({
      publicFileName: file.originalname,
      localFileName: file.filename,
      filePath: file.path,
      extension: this.extractFileExtension(file.originalname),
    });

    return mediaFile;
  }

  private extractFileExtension(fileName: string): string {
    return fileName.replace(/^.+\.(.+)$/, '$1');
  }
}
