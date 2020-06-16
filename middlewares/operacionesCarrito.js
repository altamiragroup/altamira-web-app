const Cart = require('../database/mongo/models/models').Cart;
const carrito = require('../helpers/carrito');
const functions = require('../helpers/catalogo');

module.exports = (req, res, next) => {

    if(req.session.user != 'invitado'){
        let cliente = req.session.user.numero;
        // consultar si existe un carro en la DB
        Cart.findOne({ cliente: cliente },(error, result) => {
            if(error) return console.log(error);
            if(result == null){
                carrito.iniciarCarrito(req);
            }
        })
    }
    const query = req.query;

    if(query.eliminar_articulo){
        carrito.eliminarProducto(req, res);
        return next();
    }
    if(query.pendiente){
        let { pendiente, cantidad, action } = query
        
        functions.actualizarPendientes(pendiente,cantidad,action,res)

        return next();
    }
    
    return next()
}    