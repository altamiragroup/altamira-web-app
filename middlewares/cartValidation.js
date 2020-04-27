const cart = require('../helpers/carritoFunctions');
const functions = require('../helpers/catalogoFunctions');

module.exports = (req, res, next) => {

    const query = req.query;

    if(req.session.cart == undefined){
        cart.createCart(req,res);
    }

    if(query.agregar_articulo){

        cart.addProduct(req, res);
        return next();
    }  
    if(query.eliminar_articulo){
        cart.deleteProduct(req, res);
        return next();
    }
    if(query.pendiente){
        let { pendiente, cantidad, action } = query
        
        functions.actualizarPendientes(pendiente,cantidad,action,res)

        return next();
    }
    if(query.update){
        cart.updateProduct(req, res);
        return next();
    }

    return next()
}    