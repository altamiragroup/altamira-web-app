var express = require('express');
var router = express.Router();
const validarSesion = require('../middlewares/validarSesion');
const clienteController = require("../controllers/clienteController");


router.get('/perfil', validarSesion.cliente ,clienteController.perfil);
router.get('/comprobantes', validarSesion.cliente ,clienteController.comprobantes);
router.get('/comprobantes/factura', validarSesion.cliente, clienteController.factura);
module.exports = router;
