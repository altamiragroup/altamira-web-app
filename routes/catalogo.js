const express = require('express');
const router = express.Router();
const controller = require('../controllers/catalogo');

const carrito = require('../middlewares/carrito');
const auth = require('../middlewares/auth');
const actualizar_carrito = require('../middlewares/actualizarCarrito');
const filtros = require('../middlewares/filtrosCatalogo');

router.use(filtros);

router.get('/', carrito, controller.inicio);
router.post('/', carrito, controller.inicio);
router.get('/filtro', carrito, controller.filtro);
router.get('/resume', auth.cliente, actualizar_carrito, carrito, controller.resumen);
router.get('/resume/actualizar', auth.cliente, carrito, controller.actualizar);
router.get('/pendientes', auth.cliente, actualizar_carrito, carrito, controller.pendientes);
router.get('/relacionados', auth.cliente, carrito, controller.relacionados);
router.get('/finalizar', auth.cliente, actualizar_carrito, controller.finalizar);
router.post('/checkout', auth.cliente, actualizar_carrito, controller.checkout);
router.get('/detalle/:articuloId', controller.detalle);

module.exports = router;
