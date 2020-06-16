var express = require('express');
var router = express.Router();
const controller = require('../controllers/admin');
const auth = require('../middlewares/auth').admin;

router.get('/panel', auth, controller.panel);

router.get('/clientes', auth, controller.clientes);
router.post('/clientes', auth, controller.clientes);

router.get('/comprobantes', auth, controller.comprobantes);
router.post('/comprobantes', auth, controller.comprobantes);

router.get('/registro', auth, controller.registro)
router.post('/registro', auth, controller.setRegistro);

router.get('/seguimientos', auth, controller.seguimiento);
router.post('/seguimientos', auth, controller.seguimiento);

router.get('/prueba', auth, controller.prueba);

module.exports = router;
