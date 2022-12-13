import { MediaFile } from './MediaFile';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  public isPrivate: boolean;

  @OneToMany(() => MediaFile, mediaFile => mediaFile.gallery)
  public mediaFiles: MediaFile[];

  public static createOne(options: CreateGalleryOptions): Gallery {
    const plain = { ...options };
    Reflect.setPrototypeOf(plain, Gallery);

    return plain as Gallery;
  }
}

type CreateGalleryOptions = Omit<
  {
    [P in keyof Gallery]: Gallery[P] extends Function ? unknown : Gallery[P];
  },
  'id'
>;
