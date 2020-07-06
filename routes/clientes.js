const express = require('express');
const router = express.Router();
const controller = require("../controllers/clientes");
const auth = require('../middlewares/auth').cliente;
const upload = require('../middlewares/multer')

router.get('/perfil', auth, controller.perfil);
router.get('/comprobantes', auth, controller.comprobantes);
router.get('/comprobantes/credito', auth, controller.credito);
router.get('/comprobantes/:numero',auth, controller.detalle);
router.get('/comprobantes/credito/:numero', auth, controller.detalle_credito);
router.get('/pagos', auth, controller.pagos);
router.post('/pagos', auth, upload.single('archivo') , controller.send);
router.get('/pedidos', auth, controller.pedidos);

module.exports = router;
