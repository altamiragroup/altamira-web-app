const { getConnection, sql } = require('./database/config/sqlserver');

async function testUpdate() {
  try {
    const pool = await getConnection();

    await pool.request()
      .input('codigo', sql.VarChar, 'TEST123')
      .input('descripcion', sql.VarChar, 'Producto actualizado desde Node 🔥')
      .query(`
        UPDATE articulos
        SET descripcion = @descripcion
        WHERE codigo = @codigo
      `);

    console.log('✅ UPDATE ejecutado correctamente');
  } catch (error) {
    console.error('❌ Error en UPDATE:', error);
  }
}

testUpdate();