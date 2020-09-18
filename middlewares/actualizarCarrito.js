const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Cart = require('../database/mongo/models/models').Cart;

module.exports = async (req, res, next) => {
    const cliente = req.session.user.numero;
	
    try {
        const _cliente = await db.clientes.findOne({
            where: { numero: cliente },
            logging: false
        });
        const carrito = await Cart.findOne({ cliente });
        
        let itemsCarrito = [];
        let totalCarrito = 0;

        for(articulo of carrito.articulos){
            itemsCarrito.push({ codigo : articulo.codigo })
        }

        let articulosDB = await db.articulos.findAll({
            where : { [Op.or]: itemsCarrito },
            attributes : ['codigo','precio','stock'],
            logging : false
        })

        for(artDB of articulosDB){
            for(articulo of carrito.articulos){
                if(articulo.codigo == artDB.codigo){

                    articulo.precio = artDB.precio;
                    articulo.stock = artDB.stock;
                    // actualizar total del carrito
                    totalCarrito += articulo.precio * articulo.cantidad
                }
            }
        }
        carrito.values.descuento = _cliente.obtenerDescuentoCliente()
        carrito.values.total = totalCarrito / 100;
        // Notificar cambios
        await carrito.markModified('articulos','values');
        await carrito.save()
    }
    catch(error){
        console.error({
            message : 'error actualizando carrito',
            error
        })
    }
    finally {
        return next()
    }
}