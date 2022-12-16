import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gallery } from '../../gallery/entity/Gallery';
import { JoinColumn } from 'typeorm/browser';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  public readonly id: number;

  @Column({
    type: 'varchar',
  })
  public name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  public email: string;

  @Column({
    type: 'varchar',
  })
  public password: string;

  @OneToOne(() => Gallery, gallery => gallery.user, {
    cascade: ['insert'],
  })
  @JoinColumn()
  public gallery: Gallery;
}
