import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../database/entities/base.entity';
import jwt from 'jsonwebtoken';
import { Link } from './link.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 32 })
  firstName: string;

  @Column({ length: 32 })
  lastName: string;

  @Column({ length: 36 })
  uuid: string;

  @Column({ nullable: true })
  apiToken?: string;

  generateJWT = (duration: string = '5m'): void => {
    this.apiToken = jwt.sign(
      {
        id: this.id,
        uuid: this.uuid,
        firstName: this.firstName,
        lastName: this.lastName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: duration,
      },
    );
  };
}
