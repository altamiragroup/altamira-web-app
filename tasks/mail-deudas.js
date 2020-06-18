const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const mailer = require('../helpers/mailHelp');
const cron = require('node-cron');

async function enviarEmailDeudas(){
    try {
        let comprobantes = await db.comprobantes.findAll({
            where : {
                [Op.and] : [{
                    fecha : {
                        [Op.lt]: new Date(new Date() - 40 * 24 * 60 * 60 * 1000),
                        [Op.gt]: new Date(new Date() - 41 * 24 * 60 * 60 * 1000)
                    },
                    tipo : { [Op.like]: '%Factura%' }
                }]
            },
            include : [{ model : db.clientes, as : 'cliente', attributes : ['razon_social','correo'] }],
            attributes : ['numero','fecha','valor']
        })

        async function enviarEstadoCuenta(comprobante){
            let cliente = comprobante.cliente.razon_social;
            let correo = comprobante.cliente.correo;
            let numero = comprobante.numero;
            let fecha = comprobante.formatDate();
            let monto = comprobante.valor;
            mailer.deuda(cliente, correo, numero, fecha, monto);
        }

        for(item of comprobantes){
            if(item.cliente.correo == ''){
                continue
            }
            console.log('Email enviado a ' + item.cliente.razon_social)
            enviarEstadoCuenta(item)
        }
    }
    catch(e){
        console.error(e)
    }
}
 
let task = cron.schedule('0 8 * * *', () =>  {
  enviarEmailDeudas()
},{
   scheduled: true,
   timezone: "America/Argentina/Buenos_Aires"
});
 
task.start();