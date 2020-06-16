const carrito = require('../../../helpers/carrito');
const filtros = require('../../../helpers/filtros');

module.exports = {
    articulos : async (req, res) => {
        let cliente = req.session.user.numero;
        let cart = await carrito.traer(cliente)
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
        let cliente = req.session.user.numero;
        let articulo = req.query.agregar_articulo;
        let cantidad = req.query.cant ? req.query.cant : null;
        carrito.agregarArticulo(cliente, articulo, cantidad)
        return res.send('OK')
    },
    actualizar : (req, res) => {
        let cliente = req.session.user.numero;
        let accion = req.query.update;
        let articulo = req.query.item;
        let cantidad = req.query.cant ? req.query.cant : null;
        
        carrito.actualizarArticulo(cliente, articulo, accion, cantidad)
        return res.send('OK')
    },
    eliminar : (req, res) => {
        let cliente = req.session.user.numero;
        let articulo = req.query.eliminar_articulo;
        carrito.eliminarArticulo(cliente, articulo)
        return res.send('OK')
    },
    filtros : async (req, res) => {
        let filtrosAplicados = await filtros.traerArrayFiltros(req, res);
		// Disable caching for content files
		res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        return res.send(filtrosAplicados)
    }
}