import { Injectable, Inject } from '@nestjs/common';
import { Op, literal } from 'sequelize';
/**
 * MODEL
 */
import { Users } from '@/models/users.model';
import { PhoneNumbers } from '@/models/phone_numbers.model';

import { CreateDto } from './dto/requests/create.dto';
import { UpdateAgeDto } from './dto/requests/update-age.dto';
import { UsersDto } from './dto/responses/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
  ) {}

  async findAll({
    STARTPAGE,
    PERPAGE,
    SORT,
    SORT_BY,
    SEARCH = '',
  }): Promise<{ rows: UsersDto[]; count: number }> {
    console.log('SORT_BY', SORT_BY);

    const { count, rows } = await this.usersRepository.findAndCountAll<Users>({
      include: {
        model: PhoneNumbers,
        // on: {
        //   col1: where(col('users.id'), '=', col('phoneNumbers.usersId')),
        // },
        required: false,
        attributes: [`id`, `number`, `brand`],
      },
      where: {
        [Op.or]: [
          {
            user: {
              [Op.like]: `%${SEARCH}%`,
            },
          },
        ],
      },
      // order: [[SORT_BY, SORT]],
      order: literal(`${SORT_BY} ${SORT}`),
      offset: STARTPAGE,
      limit: PERPAGE,
      attributes: ['user', 'age'],
      logging: console.log,
    });
    return { rows, count };
  }

  async findOne(id: number): Promise<UsersDto> {
    return await this.usersRepository.findOne<Users>({
      include: {
        model: PhoneNumbers,
        required: false,
        attributes: [`id`, `number`, `brand`],
      },
      where: {
        [Op.and]: [{ id: id }],
      },
      attributes: ['user', 'age'],
    });
  }

  async update(payload: CreateDto, id: number) {
    return await this.usersRepository.update(payload, {
      where: { id },
    });
  }

  async updateAge(payload: UpdateAgeDto, id: number) {
    return await this.usersRepository.update(payload, {
      where: { id },
    });
  }

  async create(payload: CreateDto | any) {
    return await this.usersRepository.create(payload);
  }

  async delete(id: number) {
    return await this.usersRepository.destroy({ where: { id } });
  }
}
