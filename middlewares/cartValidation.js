const cart = require('../helpers/carritoFunctions');

module.exports = (req, res, next) => {
    console.log('------ Carrito de compras ------');
    const action = req.query;

    if(req.session.cart == undefined){
        cart.createCart(req,res);
    }

    if(action.agregar_articulo){

        cart.addProduct(req, res);
        return next();
    }    

    return next()
}    