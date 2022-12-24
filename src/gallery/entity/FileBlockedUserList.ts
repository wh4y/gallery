import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/User';
import { MediaFile } from './MediaFile';

@Entity()
export class FileBlockedUserList {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @OneToOne(() => MediaFile, file => file.blockedUserList)
  public readonly mediaFile: MediaFile;

  @ManyToMany(() => User)
  @JoinTable()
  public readonly blockedUsers: User[];

  public static createOneWith(
    options: Partial<FileBlockedUserList>,
  ): FileBlockedUserList {
    const defaultOptions: typeof options = { blockedUsers: [] };
    const blockedUserList = Object.assign(defaultOptions, options);
    Reflect.setPrototypeOf(blockedUserList, FileBlockedUserList.prototype);

    return blockedUserList as FileBlockedUserList;
  }

  public withBlockedUsers(blockedUsers: User[]): FileBlockedUserList {
    return FileBlockedUserList.createOneWith({ ...this, blockedUsers });
  }
}
