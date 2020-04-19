const cart = require('../helpers/carritoFunctions');
const functions = require('../helpers/catalogoFunctions');

module.exports = (req, res, next) => {

    const action = req.query;

    if(req.session.cart == undefined){
        cart.createCart(req,res);
    }

    if(action.agregar_articulo){

        cart.addProduct(req, res);
        return next();
    }  
    if(action.eliminar_articulo){
        cart.deleteProduct(req, res);
        return next();
    }
    if(action.agregar_pendiente){
        let art = action.agregar_pendiente
        let cant = action.cant
        
        functions.borrarPendiente(art,cant,res)

        return next();
    }
    if(action.update){
        cart.updateProduct(req, res);
        return next();
    }

    return next()
}    