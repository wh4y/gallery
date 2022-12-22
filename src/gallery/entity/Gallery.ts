import { MediaFile } from './MediaFile';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/User';
import { GalleryBlockedUserList } from './GalleryBlockedUserList';

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  public readonly isPrivate: boolean;

  @OneToMany(() => MediaFile, mediaFile => mediaFile.gallery, {
    cascade: ['insert'],
  })
  public readonly mediaFiles: MediaFile[];

  @OneToOne(() => User, user => user.gallery, {
    onDelete: 'CASCADE',
  })
  public readonly owner: User;

  @OneToOne(() => GalleryBlockedUserList, list => list.gallery, {
    cascade: ['insert'],
  })
  @JoinColumn()
  public readonly blockedUserList: GalleryBlockedUserList;

  public static createOneWith(options: Partial<Gallery>): Gallery {
    const defaultOptions: typeof options = { isPrivate: false, mediaFiles: [] };
    const gallery = Object.assign(defaultOptions, options);
    Reflect.setPrototypeOf(gallery, Gallery.prototype);

    return gallery as Gallery;
  }

  public withIsPrivate(isPrivate: boolean): Gallery {
    return Gallery.createOneWith({ ...this, isPrivate });
  }

  public withMediaFiles(mediaFiles: MediaFile[]): Gallery {
    return Gallery.createOneWith({ ...this, mediaFiles });
  }
}
