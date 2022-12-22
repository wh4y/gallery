import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/User';
import { Gallery } from './Gallery';

@Entity()
export class GalleryBlockedUserList {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @OneToOne(() => Gallery, gallery => gallery.id)
  public readonly gallery: Gallery;

  @ManyToMany(() => User)
  @JoinTable()
  public readonly blockedUsers: User[];

  public static createOneWith(
    options: Partial<GalleryBlockedUserList>,
  ): GalleryBlockedUserList {
    const defaultOptions: typeof options = { blockedUsers: [] };
    const blockedUserList = Object.assign(defaultOptions, options);
    Reflect.setPrototypeOf(blockedUserList, GalleryBlockedUserList.prototype);

    return blockedUserList as GalleryBlockedUserList;
  }

  public withBlockedUsers(blockedUsers: User[]): GalleryBlockedUserList {
    return GalleryBlockedUserList.createOneWith({ ...this, blockedUsers });
  }
}
