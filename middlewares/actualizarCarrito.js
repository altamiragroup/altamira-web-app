const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Cart = require('../database/mongo/models/models').Cart;
const catalogo = require('../helpers/catalogo');

module.exports = async (req, res, next) => {
    const cliente = req.session.user.numero;
	const carrito = await Cart.findOne({ cliente: cliente });
    let itemsCarrito = [];
    let totalCarrito = 0;

    for(articulo of carrito.articulos){
        itemsCarrito.push({ codigo : articulo.codigo })
    }
    db.articulos.findAll({
        where : { [Op.or]: itemsCarrito },
        attributes : ['codigo','precio','stock'],
        logging : false
    })
    .then(articulosDB => {
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
        carrito.actualizado = catalogo.fechaActual();
        carrito.values.total = totalCarrito / 100;
        /*
        Al ser un array de objetos, mongoose no detecta el cambio
        automaticamente, por lo que hay que especificarle
        donde estamos realizando el cambio para que el lo actualice
        con el metodo markModified()
        */
        carrito.markModified('articulos','values');
        carrito.save(function(error){
            if(error) console.log(error)
        })

        return next()
    })
    .catch(error => {
        console.log(error)
        return next()
    })
    

}