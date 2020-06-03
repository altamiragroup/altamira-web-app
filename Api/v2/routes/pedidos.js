const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidos')

router.get('/', controller.pedidos)
router.get('/:id', controller.detalle)

module.exports = router