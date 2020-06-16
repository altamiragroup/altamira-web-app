const express = require('express');
const router = express.Router();
const controller = require("../controllers/clientes");
const validarSesion = require('../middlewares/validarSesion');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer')

router.get('/perfil',auth.cliente, validarSesion.cliente ,controller.perfil);
router.get('/comprobantes',auth.cliente, validarSesion.cliente ,controller.comprobantes);
router.get('/comprobantes/:numeroComp',auth.cliente, validarSesion.cliente, controller.detalle);

router.get('/pagos',auth.cliente, validarSesion.cliente, controller.pagos);
router.post('/pagos',auth.cliente, validarSesion.cliente, upload.single('archivo') ,controller.send);

router.get('/pedidos',auth.cliente, validarSesion.cliente, controller.pedidos);

module.exports = router;
