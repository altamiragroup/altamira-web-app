const db = require('../database/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const mailer = require('../helpers/mailHelp');
const cron = require('node-cron');

async function actLista() {
    try {
        const articulos = await db.articulos.findAll({
          where: {
            estado: 1
          },
          order: [['orden'], ['linea_id'], ['rubro_id'], ['renglon'], ['codigo']],          
          logging: false,
        });
        const rutaArchivo = `${__dirname}/../lista_altamira`;
  
        fs.writeFileSync(rutaArchivo, "codigo;oem;descripcion;modelos;(Math.round(articulo.precio / 100))\n", { encoding: "utf-8"})
  
        for (art of articulos) {
          const data = `${art.codigo};${art.oem};${art.descripcion};${art.modelos};${art.precio};\n`;
          fs.appendFileSync(rutaArchivo, data, { encoding: "utf-8"})
        }
  
        return res.download(rutaArchivo)
      } catch (err) {
        console.error({
          message: 'Error en el catálogo',
          err,
        });
      }
}

let task = cron.schedule(
  '0 29 11 * * *', // TO DO: actualiza cuando corre
  () => {
    actLista();
  },
  {
    scheduled: true,
    timezone: 'America/Argentina/Buenos_Aires',
  }
);
let task2 = cron.schedule(
  '0 23 19 * * *', // TO DO: actualiza cuando corre
  () => {
    actLista();
  },
  {
    scheduled: true,
    timezone: 'America/Argentina/Buenos_Aires',
  }
);

task.start();
task2.start();