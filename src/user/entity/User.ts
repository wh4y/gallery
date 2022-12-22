import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gallery } from '../../gallery/entity/Gallery';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @Column({
    type: 'varchar',
  })
  public readonly name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  public email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public readonly password: string;

  @OneToOne(() => Gallery, gallery => gallery.owner, {
    cascade: ['insert'],
    nullable: false,
  })
  @JoinColumn()
  public readonly gallery: Gallery;

  public static createOneWith(options: Partial<User>): User {
    const user = { ...options };
    Reflect.setPrototypeOf(user, User.prototype);

    return user as User;
  }

  public withName(name: string): User {
    return User.createOneWith({ ...this, name });
  }

  public withEmail(email: string): User {
    return User.createOneWith({ ...this, email });
  }

  public withPassword(password: string): User {
    return User.createOneWith({ ...this, password });
  }

  public withGallery(gallery: Gallery): User {
    return User.createOneWith({ ...this, gallery });
  }
}
