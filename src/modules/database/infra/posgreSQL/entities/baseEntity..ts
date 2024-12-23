import {
  BaseEntity as BaseEntityTypeORM,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export class BaseEntity extends BaseEntityTypeORM {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @VersionColumn()
  readonly version: number;
}
