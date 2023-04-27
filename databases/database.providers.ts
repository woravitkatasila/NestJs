import { Sequelize } from 'sequelize-typescript';

/** CONFIG */
import { MYSQL } from '../config/app-config';

/** MODELS */
import { Users } from 'models/users.model';
import { PhoneNumbers } from '@/models/phone_numbers.model';
import { Accounts } from '@/models/accounts.model';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: MYSQL.host,
  port: Number(MYSQL.port),
  username: MYSQL.user,
  password: MYSQL.password,
  database: MYSQL.database,
  logging: false,
});

const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      sequelize.addModels([Users, PhoneNumbers, Accounts]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

const define = (name, option) => sequelize.define(name, option);

export { databaseProviders, define };
