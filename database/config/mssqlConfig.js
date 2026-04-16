require('dotenv').config();

const {
  DB_MSSQL_USERNAME,
  DB_MSSQL_PASSWORD,
  DB_MSSQL_DATABASE,
  DB_MSSQL_HOST
} = process.env;

module.exports = {
  user: DB_MSSQL_USERNAME,
  password: DB_MSSQL_PASSWORD,
  server: DB_MSSQL_HOST,
  database: DB_MSSQL_DATABASE,
  options: {
  encrypt: false,
  trustServerCertificate: true,
  enableArithAbort: true
  }
};
