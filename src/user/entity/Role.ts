import { Entity, PrimaryColumn } from 'typeorm';
import { Roles } from '../core/Roles';

@Entity()
export class Role {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
  })
  public readonly name: Roles;

  public static createOneWith(options: Partial<Role>): Role {
    const plain = { ...options };
    Reflect.setPrototypeOf(plain, Role.prototype);

    return plain as Role;
  }
}
