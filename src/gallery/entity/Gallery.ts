import { MediaFile } from './MediaFile';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/User';

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  public isPrivate: boolean;

  @OneToMany(() => MediaFile, mediaFile => mediaFile.gallery, {
    cascade: ['insert'],
  })
  public mediaFiles: MediaFile[];

  @OneToOne(() => User, user => user.gallery, {
    onDelete: 'CASCADE',
  })
  public user: User;

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
