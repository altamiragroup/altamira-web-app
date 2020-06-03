const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidos')

router.get('/', controller.pedidos)

module.exports = router