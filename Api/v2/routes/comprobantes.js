const express = require('express');
const router = express.Router();
const controller = require('../controllers/comprobantes')

router.get('/', controller.comprobantes);
router.get('/:numero', controller.detalle);
router.get('/cuenta/:cuenta', controller.cuenta);
router.post('/pago', controller.pago);

module.exports = router