import { Entity, PrimaryColumn } from 'typeorm';
import { RoleEnum } from '../core/RoleEnum';

@Entity()
export class Role {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
  })
  public readonly name: RoleEnum;

  public static createOneWith(options: Partial<Role>): Role {
    const plain = { ...options };
    Reflect.setPrototypeOf(plain, Role.prototype);

    return plain as Role;
  }
}
