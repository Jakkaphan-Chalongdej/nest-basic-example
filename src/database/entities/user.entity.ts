import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ENUMGender } from '../../shared/enum/type.enum';
import { DB_TABLE, ENUMTypeColumnEntity } from '../common/enum/database.enum';
import { SERIALIZE_GROUP } from '../common/enum/serialization-group.enum';
import { ExtendedEntity } from '../common/extended-entity';

@Entity(DB_TABLE.USER)
export class UserEntity extends ExtendedEntity {
  @PrimaryGeneratedColumn({ type: ENUMTypeColumnEntity.TYPE_ID })
  @Expose({ groups: [SERIALIZE_GROUP.GROUP_ALL_USER] })
  id: number;

  @Column({ type: 'uuid', generated: 'uuid', unique: true })
  @Expose({ groups: [SERIALIZE_GROUP.GROUP_ALL_USER] })
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  @Expose({ groups: [] })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  @Expose({ groups: [] })
  lastName: string;

  @Column({ type: 'enum', enum: ENUMGender })
  @Expose({ groups: [SERIALIZE_GROUP.GROUP_ALL_USER] })
  gender: string;

  @Expose({ groups: [SERIALIZE_GROUP.GROUP_ALL_USER], name: 'fullName' })
  fullName() {
    const fullName = [this.firstName, this.lastName].join(' ').trim();
    return fullName;
  }
}
