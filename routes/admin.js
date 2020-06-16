var express = require('express');
var router = express.Router();
const controller = require('../controllers/admin');


router.get('/panel', controller.panel);

router.get('/clientes', controller.clientes);
router.post('/clientes', controller.clientes);

router.get('/comprobantes', controller.comprobantes);
router.post('/comprobantes', controller.comprobantes);

router.get('/registro', controller.registro)
router.post('/registro', controller.setRegistro);

router.get('/seguimientos', controller.seguimiento);
router.post('/seguimientos', controller.seguimiento);

router.get('/prueba', controller.prueba);

module.exports = router;
