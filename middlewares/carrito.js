const Cart = require('../database/mongo/models/models').Cart;
const carrito = require('../helpers/carrito');
const catalogo = require('../helpers/catalogo');

module.exports = async (req, res, next) => {
  if (req.session.user) {
    const cliente = req.session.user.numero;
    const query = req.query;

    if (req.session.user.tipo == 'cliente') {
      let carrito_user = await Cart.findOne({ cliente });

      if (!carrito_user) {
        carrito.nuevo(cliente);
      }
    }

    if (query.eliminar_articulo) {
      let articulo = query.eliminar_articulo;

      carrito.eliminarArticulo(cliente, articulo);
      return res.redirect('/catalogo/resume');
    }

    if (query.pendiente) {
      let articulo = query.pendiente;
      let cantidad = parseInt(query.cantidad);
      let accion = query.action;

      catalogo.actualizarPendientes(cliente, articulo, cantidad, accion);
    }

    return next();
  }

  return next();
};
