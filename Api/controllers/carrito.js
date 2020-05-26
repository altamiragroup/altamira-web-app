const carrito = require('../../helpers/carrito');
const filtros = require('../../helpers/filtros');

module.exports = {
    articulos : async (req, res) => {
        let cart = await carrito.traerCarrito(req)
        if(cart != null){
            return res.send(cart.articulos)
        }
    },
    agregar : (req, res) => {
        carrito.agregarProducto(req)
        return res.send('OK')
    },
    eliminar : (req, res) => {
        carrito.eliminarProducto(req)
        return res.send('OK')
    },
    filtros : async (req, res) => {
        let filtrosAplicados = await filtros.traerFiltros(req, res);
        return res.send(filtrosAplicados)
    }
}