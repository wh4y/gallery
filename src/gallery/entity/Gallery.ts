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
}
