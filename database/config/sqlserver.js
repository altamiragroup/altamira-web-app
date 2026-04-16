const sql = require('mssql');
const config = require('./mssqlConfig');

let pool;

async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('🟢 Conectado a SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('🔴 Error conexión SQL Server:', error);
    throw error;
  }
}

module.exports = {
  sql,
  getConnection
};