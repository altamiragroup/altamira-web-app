const mailer = require('../helpers/mailHelp');
const cron = require('node-cron');

async function enviarListaPrecios() {
  try {
    const clientes = [
      {
        razon_social: 'Altamira Group',
        correo: 'info@altamiragroup.com.ar',
      },
      {
        razon_social: 'Altamira Group',
        correo: 'publicidad@altamiragroup.com.ar',
      },
    ];
    async function enviarEmail(cliente) {
      const { razon_social, correo } = cliente;
      await mailer.listaPrecios(razon_social, correo);
    }

    for (item of clientes) {
      if (item.correo != '') {
        await enviarEmail(item);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
// se envia al correr el proceso
enviarListaPrecios();
// se envia cada viernes
let task = cron.schedule(
  '0 16 * * 5',
  () => {
    enviarListaPrecios();
  },
  {
    scheduled: true,
    timezone: 'America/Argentina/Buenos_Aires',
  }
);

task.start();
