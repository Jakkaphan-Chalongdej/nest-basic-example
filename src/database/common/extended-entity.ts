import { Expose } from 'class-transformer';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ENUMTypeColumnEntity } from './enum/database.enum';
import { SERIALIZE_GROUP } from './enum/serialization-group.enum';

export class ExtendedEntity extends BaseEntity {
  public id?: number;

  @Column({ type: 'bool', default: false, name: 'is_delete' })
  @Expose({
    groups: [],
  })
  public isDelete: boolean;

  @Column({ type: 'bool', default: true, name: 'is_edit' })
  @Expose({
    groups: [SERIALIZE_GROUP.GROUP_BASE],
  })
  public isEdit: boolean;

  // @Column({ type: ENUMTypeColumnEntity.TYPE_DATE, name: 'created_at' })
  @CreateDateColumn({ name: 'created_at' })
  @Expose({
    groups: [SERIALIZE_GROUP.GROUP_BASE],
  })
  public createdAt: Date;

  // @Column({
  //   type: ENUMTypeColumnEntity.TYPE_DATE,
  //   name: 'updated_at',
  //   nullable: true,
  // })
  @UpdateDateColumn({ name: 'updated_at' })
  @Expose({
    groups: [SERIALIZE_GROUP.GROUP_BASE],
  })
  public updatedAt: Date;

  @Column({
    type: ENUMTypeColumnEntity.TYPE_TIMESTAMP,
    name: 'deleted_at',
    nullable: true,
  })
  @Expose({
    groups: [SERIALIZE_GROUP.GROUP_BASE],
  })
  deletedAt: Date;

  // @BeforeInsert()
  // newDate() {
  //   const _now = new Date().getTime();
  //   this.createdAt = _now;
  //   this.updatedAt = _now;
  // }
}
