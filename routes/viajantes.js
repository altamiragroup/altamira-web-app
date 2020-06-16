var express = require('express');
var router = express.Router();
const controller = require('../controllers/viajantes');


router.get('/perfil', controller.panel);

router.get('/clientes', controller.clientes);
router.post('/clientes', controller.clientes);

router.get('/cobranzas', controller.cobranzas);
router.post('/cobranzas', controller.cobranzas);
router.get('/cobranzas/pdf', controller.pdf);


router.get('/seguimientos', controller.seguimiento);
router.post('/seguimientos', controller.seguimiento);

module.exports = router;
