import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column('longtext')
  detail: string;

  @Column('int', { default: 20 })
  limitUser: number;

  @Column('longtext', { default: '{}' })
  pixelData: string;
}
