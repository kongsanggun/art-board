import { BaseEntity as TypeOrmBaseEntity, Column } from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
