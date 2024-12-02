import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  detail: string;

  @Column()
  data: string;
}
