const express = require('express');
const router = express.Router();
const controller = require('../controllers/clientes')

router.get('/', controller.clientes)

module.exports = router