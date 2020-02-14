var express = require('express');
var router = express.Router();
const validarSesion = require('../middlewares/validarSesion');
const clienteController = require("../controllers/clienteController");


router.get('/perfil', validarSesion.cliente ,clienteController.perfil);
router.get('/comprobantes', validarSesion.cliente ,clienteController.comprobantes);
router.get('/comprobantes/:tipoComp/:numeroComp', validarSesion.cliente, clienteController.detalle);
router.get('/pagos', validarSesion.cliente, clienteController.pagos);
router.get('/seguimiento', validarSesion.cliente, clienteController.seguimiento);

module.exports = router;
