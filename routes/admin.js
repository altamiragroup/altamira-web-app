var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/panel', adminController.panel);

router.get('/clientes', adminController.clientes);
router.post('/clientes', adminController.clientes);

router.get('/comprobantes', adminController.comprobantes);
router.post('/comprobantes', adminController.comprobantes);

router.get('/registro', adminController.registro)
router.post('/registro', adminController.setRegistro);

router.get('/seguimientos', adminController.seguimiento);
router.post('/seguimientos', adminController.seguimiento);

module.exports = router;
