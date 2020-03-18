var express = require('express');
var router = express.Router();
const controller = require('../controllers/viajanteController');


router.get('/perfil', controller.panel);

router.get('/clientes', controller.clientes);
router.post('/clientes', controller.clientes);

router.get('/cobranzas', controller.cobranzas);
router.post('/cobranzas', controller.cobranzas);

router.get('/seguimiento', controller.seguimiento);
router.post('/seguimiento', controller.seguimiento);

module.exports = router;
