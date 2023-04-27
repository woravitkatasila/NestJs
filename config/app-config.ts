import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const PORT = process.env.APP_PORT || 80;
const MYSQL = {
  queueLimit: 0, // unlimited queueing
  connectionLimit: 120, // unlimited connections
  multipleStatements: true,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  debug: false,
};

const APP = {
  title: process.env.APP_TITLE,
  description: process.env.APP_DESCRIPTION,
  version: process.env.APP_VERSION,
};

const BITLY = {
  client_id: ``,
  client_secret: ``,
  token: ``,
};

const STATIC_URL = 'files';
const STATIC_EXCEL = 'excel';

export { PORT, MYSQL, APP, BITLY, STATIC_URL, STATIC_EXCEL };
