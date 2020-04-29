const express = require('express');
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const validarSesion = require('../middlewares/validarSesion');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer')

router.get('/perfil',auth.cliente, validarSesion.cliente ,clienteController.perfil);
router.get('/comprobantes',auth.cliente, validarSesion.cliente ,clienteController.comprobantes);
router.get('/comprobantes/:numeroComp',auth.cliente, validarSesion.cliente, clienteController.detalle);

router.get('/pagos',auth.cliente, validarSesion.cliente, clienteController.pagos);
router.post('/pagos',auth.cliente, validarSesion.cliente, upload.single('archivo') ,clienteController.send);

router.get('/pedidos',auth.cliente, validarSesion.cliente, clienteController.pedidos);

module.exports = router;
