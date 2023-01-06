import { CrudService } from '@Base/crud.service';
import { SERIALIZE_GROUP } from '@Database/common/enum/serialization-group.enum';
import { UserEntity } from '@Database/entities/user.entity';
import { faker } from '@faker-js/faker';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ENUMErrorMessage } from '@Shared/enum/error-message.enum';
import { ENUMGender2 } from '@Shared/enum/type.enum';
import { getConvertDateFilter } from '@Shared/helper/date-helper';
import { paginateResponse } from '@Shared/response/response';
import { instanceToPlain } from 'class-transformer';
import { Repository, DataSource, Brackets } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryStringUserDto } from './dto/query-string-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends CrudService<UserEntity> {
  protected readonly repository: Repository<UserEntity>;
  constructor(private readonly dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(UserEntity);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = new UserEntity();
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.gender = createUserDto.gender;

      return await this.repository.save(user);
    } catch {
      throw new BadRequestException();
    }
  }

  async generateUsers(user: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < user; i++) {
        const user = new UserEntity();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.gender =
          ENUMGender2['0' + Math.floor(Math.random() * 2).toString()];
        await queryRunner.manager.save(user);
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException();
    }
  }

  async test() {
    const userIds = [1, 2];
    let result = await this.repository
      .createQueryBuilder('user')
      .whereInIds(userIds)
      .getMany();
    return result;
  }

  async findAllUser(qs: QueryStringUserDto) {
    const { limit, orderby, page, startDate, endDate, search } = qs;
    const [users, total] = await this.repository
      .createQueryBuilder('user')
      .where('user.isDelete = :isDelete', { isDelete: false })
      .andWhere(
        new Brackets((qb) => {
          if (search) {
            qb.andWhere('user.fullName ILIKE :fullName', {
              fullName: `%${search}%`,
            });
          }
          if (startDate && endDate) {
            const { start, end } = getConvertDateFilter(startDate, endDate);
            qb.andWhere('user.createdAt BETWEEN :startDate AND :endDate', {
              startDate: start,
              endDate: end,
            });
          }
        }),
      )
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('id', orderby || 'DESC')
      .getManyAndCount();

    const result = instanceToPlain(users, {
      groups: [SERIALIZE_GROUP.GROUP_ALL_USER],
      strategy: 'excludeAll',
    });
    return paginateResponse(result, total, limit, page);
  }

  async findOneUser(id: number) {
    const user = await this.repository.findOne({
      where: { id: id, isDelete: true },
    });
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const validate = await this.repository.findOne({
        where: { id: id, isDelete: false },
      });
      if (!validate) {
        throw new BadRequestException(ENUMErrorMessage.NOTFOUND_USER);
      }
      validate.firstName = updateUserDto.firstName;
      validate.lastName = updateUserDto.lastName;
      validate.gender = updateUserDto.gender;
      return await this.repository.save(validate);
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    const validate = await this.repository.findOne({
      where: { id: id },
    });
    if (!validate) {
      throw new BadRequestException(ENUMErrorMessage.NOTFOUND_PRODUCT);
    }
    return await this.repository.softDelete({ id: validate.id });
  }
}
