const fs = require('fs');
const db = require('../database/models');
const cron = require('node-cron');

async function actLista() {
  try {
    const articulos = await db.articulos.findAll({
      where: {
        estado: 1,
      },
      order: [['orden'], ['linea_id'], ['rubro_id'], ['renglon'], ['codigo']],
      logging: false,
    });
    const rutaArchivo = `${__dirname}/../lista_altamira`;

    fs.writeFileSync(
      rutaArchivo,
      'codigo;oem;descripcion;modelos;precio;)\n',
      { encoding: 'utf-8' }
    );

    for (art of articulos) {
      const data = `${art.codigo};${art.oem};${art.descripcion};${art.modelos};${Math.round(art.precio / 100)};\n`;
      fs.appendFileSync(rutaArchivo, data, { encoding: 'utf-8' });
    }
  } catch (err) {
    console.error({
      message: 'Error en el catálogo',
      err,
    });
  }
}

let task = cron.schedule(
  '*/59 * * * *', // TO DO: actualiza cuando corre
  () => {
    actLista();
  },
  {
    scheduled: true,
    timezone: 'America/Argentina/Buenos_Aires',
  }
);

task.start();
