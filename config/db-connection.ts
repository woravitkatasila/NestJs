import * as mysql from 'mysql2';
import { promisify } from 'util';
import { MYSQL } from './app-config';

// MYSQL
const dbConfig = {
  host: MYSQL.host,
  user: MYSQL.user,
  password: MYSQL.password,
  database: MYSQL.database,
  debug: MYSQL.debug,
};

const createPoolAndEnsureSchema = (options) => {
  const pool = mysql.createPool(options);
  pool.on('connection', (connection) => {
    connection.query('SET NAMES "utf8mb4"');
    connection.query('SET lc_time_names = "th_TH"');
  });
  pool.query = promisify(pool.query).bind(pool);
  return pool;
};

const conn = null;
const query = (conn || createPoolAndEnsureSchema(dbConfig)).query;
const escape = mysql.escape;
export { query, escape };
