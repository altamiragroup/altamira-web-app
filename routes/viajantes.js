var express = require('express');
var router = express.Router();
const controller = require('../controllers/viajantes');
const auth = require('../middlewares/auth').viajante;

router.get('/perfil', auth, controller.panel);

router.get('/clientes', auth, controller.clientes);
router.post('/clientes', auth, controller.clientes);

router.get('/cobranzas', auth, controller.cobranzas);
router.post('/cobranzas', auth, controller.cobranzas);
router.get('/cobranzas/pdf', auth, controller.pdf);


router.get('/seguimientos', auth, controller.seguimiento);
router.post('/seguimientos', auth, controller.seguimiento);

module.exports = router;
