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
  public readonly isPrivate: boolean;

  @OneToMany(() => MediaFile, mediaFile => mediaFile.gallery, {
    cascade: ['insert'],
  })
  public readonly mediaFiles: MediaFile[];

  @OneToOne(() => User, user => user.gallery, {
    onDelete: 'CASCADE',
  })
  public readonly user: User;

  public static createOneWith(options: Partial<Gallery>): Gallery {
    const baseObject: typeof options = { isPrivate: false, mediaFiles: [] };
    const gallery = Object.assign(baseObject, options);
    Reflect.setPrototypeOf(gallery, Gallery.prototype);

    return gallery as Gallery;
  }

  public withIsPrivate(isPrivate: boolean): Gallery {
    return Gallery.createOneWith({ ...this, isPrivate });
  }

  public withMediaFiles(mediaFiles: MediaFile[]): Gallery {
    return Gallery.createOneWith({ ...this, mediaFiles });
  }

  public withUser(user: User): Gallery {
    return Gallery.createOneWith({ ...this, user });
  }
}
