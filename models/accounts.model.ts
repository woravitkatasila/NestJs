import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  // AllowNull,
  Default,
  UpdatedAt,
  CreatedAt,
  HasOne,
} from 'sequelize-typescript';
import { STATUS } from 'constants/status';
// import { ACCOUNT_TYPE } from '@/constants/account';
import { Users } from './users.model';

@Table({
  tableName: 'account',
})
export class Accounts extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @HasOne(() => Users)
  users: Users;

  @Column
  email: string;

  @Column
  saltPassword: string;

  @Column
  password: string;

  @Column(DataType.TEXT)
  accessToken: string;

  @Column(DataType.TEXT)
  refreshToken: string;

  @Default(STATUS.ACTIVE)
  @Column({ type: DataType.ENUM(...Object.values(STATUS)) })
  status: STATUS;

  @Column
  updatedBy: string;

  @UpdatedAt
  updatedAt!: Date;

  @Column
  createdBy: string;

  @CreatedAt
  @Column({ defaultValue: DataType.NOW })
  createdAt!: Date;
}
