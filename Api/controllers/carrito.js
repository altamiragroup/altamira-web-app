const carrito = require('../../helpers/carrito');
const filtros = require('../../helpers/filtros');

module.exports = {
    articulos : async (req, res) => {
        let cart = await carrito.traerCarrito(req)
        if(cart != null){

            // Disable caching for content files
		    res.setHeader('Surrogate-Control', 'no-store');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            
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
		// Disable caching for content files
		res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        return res.send(filtrosAplicados)
    }
}