import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  UpdatedAt,
  CreatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Users } from './users.model';

const brand = ['Nokia', 'Samsung', 'Apple'];

@Table({
  tableName: 'phone_numbers',
})
export class PhoneNumbers extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  number: string;

  @ForeignKey(() => Users)
  @Column
  usersId: number;

  @BelongsTo(() => Users)
  users: Users;

  @Column({
    type: DataType.ENUM({ values: brand }),
  })
  brand: string;

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
