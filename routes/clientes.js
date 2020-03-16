var express = require('express');
var router = express.Router();
const clienteController = require("../controllers/clienteController");

const validarSesion = require('../middlewares/validarSesion');
const auth = require('../middlewares/auth');

router.get('/prueba',clienteController.pruebas);

router.get('/perfil',auth.cliente, validarSesion.cliente ,clienteController.perfil);
router.get('/comprobantes',auth.cliente, validarSesion.cliente ,clienteController.comprobantes);
router.get('/comprobantes/:numeroComp',auth.cliente, validarSesion.cliente, clienteController.detalle);
router.get('/pagos',auth.cliente, validarSesion.cliente, clienteController.pagos);
router.get('/seguimiento',auth.cliente, validarSesion.cliente, clienteController.seguimiento);
router.get('/pedidos',auth.cliente, validarSesion.cliente, clienteController.pedidos);

module.exports = router;
