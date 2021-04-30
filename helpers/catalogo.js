const db = require('../database/models');
const carrito = require('./carrito');

module.exports = {
    descuentoCliente : async (numero) => {
        try {
            let cliente = await db.clientes.findOne({
                where : { numero },
                attributes : ['condicion_pago'],
                logging: false
            })
            let descuento = cliente.condicion_pago;
            if(descuento == 'A') return 25
            if(descuento == 'B') return 20
            if(descuento == 'C') return 30
        }
        catch(error){
            console.error({
                message : 'error al obtener descuento',
                error
            })
            return 25
        }

    },
    traerPendientes : async (numero) => {
        try {
            let pendientes = await db.clientes.findAll({
                where : { numero },
                attributes : ['numero'],
                include : ['articulos'],
                logging: false
            })

            return pendientes;
        }
        catch(error){
            console.error({
                message : 'error al traer pendientes',
                error
            })
        }
    },
    actualizarPendientes : async (cliente, articulo, cantidad, accion) => {
        try {
            await db.pendientes.destroy({
                where : { articulo },
                logging: false
            })
            if(accion == 'agregar'){
                await carrito.agregarArticulo(cliente, articulo, cantidad)
            }
        }
        catch(error){
            console.error({
                message : 'error al actualizar pendientes',
                error
            })
        }
    }
}