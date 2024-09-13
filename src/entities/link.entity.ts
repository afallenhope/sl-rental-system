import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  token: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  // generateURL = (length = 13): string => {
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let randomStr = '';
  //
  //   for (let i = 0; i < length; i++) {
  //     randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //
  //   return randomStr;
  // };

  generateTokenURL = (length = 32): void => {
    this.token = crypto.randomBytes(length).toString('hex');
  };
}
