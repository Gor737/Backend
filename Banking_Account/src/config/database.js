const { Client, Pool, escapeIdentifier } = require("pg");
const { DB } = require("../config/env");

const isExistDb = async () => {
  const client = new Client({
    port: DB.PORT,
    host: DB.HOST,
    database: DB.DEFAULT_NAME,
    user: DB.USER,
    password: DB.PASSWORD,
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT * FROM pg_database WHERE datname = $1`,
      [DB.NAME],
    );

    if (!res.rows.length) {
      console.log(`Database ${DB.NAME} doesn't exists: Creating ...`);
      const db_name = escapeIdentifier(DB.NAME)
      client.query(`CREATE DATABASE ${db_name}`);
    } else {
      console.log(`Database ${DB.NAME} is ready to start`);
    }
  } catch (err) {
    throw err.message;
  }finally{
    await client.end();
  }
};

let pool = null;
const getPool = () => {
  if (pool) return pool;

  pool = new Pool({
    port: DB.PORT,
    host: DB.HOST,
    database: DB.NAME,
    user: DB.USER,
    password: DB.PASSWORD,
  });

  return pool;
};

module.exports = { getPool, isExistDb };
