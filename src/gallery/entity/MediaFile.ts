import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gallery } from './Gallery';

@Entity()
export class MediaFile {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @Column({
    type: 'varchar',
  })
  public readonly publicFileName: string;

  @Column({
    type: 'varchar',
  })
  public readonly localFileName: string;

  @Column({
    type: 'varchar',
  })
  public readonly extension: string;

  @Column({
    type: 'varchar',
  })
  public readonly path: string;

  @Column({
    type: 'varchar',
  })
  public readonly destination: string;

  @Column({
    type: 'varchar',
  })
  public readonly type: FileTypes;

  @ManyToOne(() => Gallery, gallery => gallery.mediaFiles, {
    onDelete: 'CASCADE',
  })
  public readonly gallery: Gallery;

  public static createOneWith(options: Partial<MediaFile>): MediaFile {
    const plain = { ...options };
    Reflect.setPrototypeOf(plain, MediaFile.prototype);

    return plain as MediaFile;
  }

  public withPublicFileName(publicFileName: string): MediaFile {
    return MediaFile.createOneWith({ ...this, publicFileName });
  }

  public withLocalFileName(localFileName: string): MediaFile {
    return MediaFile.createOneWith({ ...this, localFileName });
  }

  public withExtension(extension: string): MediaFile {
    return MediaFile.createOneWith({ ...this, extension });
  }

  public withFilePath(filePath: string): MediaFile {
    return MediaFile.createOneWith({ ...this, path: filePath });
  }

  public withGallery(gallery: Gallery): MediaFile {
    return MediaFile.createOneWith({ ...this, gallery });
  }

  public withType(type: FileTypes): MediaFile {
    return MediaFile.createOneWith({ ...this, type });
  }
}

export enum FileTypes {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
}
