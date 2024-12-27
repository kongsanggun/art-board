import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Room extends BaseEntity {
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
