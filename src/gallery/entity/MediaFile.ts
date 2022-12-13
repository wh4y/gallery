import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gallery } from './Gallery';

@Entity()
export class MediaFile {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @Column({
    type: 'varchar',
  })
  public publicFileName: string;

  @Column({
    type: 'varchar',
  })
  public localFileName: string;

  @Column({
    type: 'varchar',
  })
  public extension: string;

  @Column({
    type: 'varchar',
  })
  public filePath: string;

  @ManyToOne(() => Gallery, gallery => gallery.mediaFiles, {
    onDelete: 'CASCADE',
  })
  public gallery: Gallery;

  public static createOne(options: CreateMediaFileOptions): MediaFile {
    const plain = { ...options };
    Reflect.setPrototypeOf(plain, MediaFile);

    return plain as MediaFile;
  }
}

type CreateMediaFileOptions = Omit<
  {
    [P in keyof MediaFile]: MediaFile[P] extends Function
      ? unknown
      : MediaFile[P];
  },
  'id'
>;
