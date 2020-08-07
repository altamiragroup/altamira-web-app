const db = require("../database/models");
const mailer = require('../helpers/mailHelp');
const cron = require('node-cron');

async function enviarListaPrecios(){
    try {
        let clientes = await db.clientes.findAll({
            where : {
            },
            attributes : ['razon_social','correo']
        })

        async function enviarEmail(cliente){
            const { razon_social, correo } = cliente;
            await mailer.listaPrecios(correo);
        }

        for(item of clientes){
            if(item.correo.contains('@')){
                await enviarEmail(item)
            }
        }
    }
    catch(e){
        console.error(e)
    }
}
 
let task = cron.schedule('0 16 * * 5', () =>  {
  enviarListaPrecios()
},{
   scheduled: true,
   timezone: "America/Argentina/Buenos_Aires"
});
 
task.start();