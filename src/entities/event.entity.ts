import { BaseEntity } from "../database/entities/base.entity";
import { Column } from "typeorm";

export class EventItem extends BaseEntity {
  @Column()
  title: string;

  @Column()
  date: Date;


  @Column()
  time: Date;

  @Column()
  landmark: string;

}
