import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entity/User';

@Entity()
export class TokenList {
  @PrimaryColumn({
    type: 'int',
  })
  public readonly userId;

  @OneToOne(() => User)
  public readonly user: User;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  public readonly refreshToken: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  public readonly accessToken: string;

  public static createOneWith(options: Partial<TokenList>): TokenList {
    const plain = { ...options };
    Reflect.setPrototypeOf(plain, TokenList.prototype);

    return plain as TokenList;
  }
}
