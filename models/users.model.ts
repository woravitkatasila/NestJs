import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  UpdatedAt,
  CreatedAt,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { PhoneNumbers } from './phone_numbers.model';
import { Accounts } from './accounts.model';

@Table({
  tableName: 'users',
})
export class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  user: string;

  @ForeignKey(() => Accounts)
  @Column
  accountId: number;

  @BelongsTo(() => Accounts)
  accounts: Accounts;

  @Column({ type: DataType.DECIMAL })
  age: number;

  @HasMany(() => PhoneNumbers)
  phoneNumbers: PhoneNumbers[];

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
