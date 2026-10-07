const { DB } = require("./env");
const Sequelize = require("sequelize");
const { escapeIdentifier } = require('pg');

const adminSequelize = new Sequelize(DB.DEFAULT_NAME, DB.USER, DB.PASSWORD, {
  host: DB.HOST,
  port: DB.PORT,
  dialect: DB.DIALECT,
});
const sequelize = new Sequelize(DB.NAME, DB.USER, DB.PASSWORD, {
  host: DB.HOST,
  port: DB.PORT,
  dialect: DB.DIALECT,
});

const ensureDatabaseExists = async () => {
  try {
    const [rows] = await adminSequelize.query(
      `SELECT * FROM pg_database WHERE datname = $1`,
      {
        bind: [DB.NAME]
      },
    );
    if (!rows.length) {
      console.log(`Database doesnt exist: Creating...`);
      const db_name = escapeIdentifier(DB.NAME);
      await adminSequelize.query(`CREATE DATABASE ${db_name}`);
    }
    console.log("Database exists.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    throw err;
  }
};

module.exports = { sequelize, ensureDatabaseExists };
