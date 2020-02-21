const cart = require('../helpers/carritoFunctions');

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
    if(action.upload){
        cart.updateProduct(req, res);
        return next();
    }

    return next()
}    