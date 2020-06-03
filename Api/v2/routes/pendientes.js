const express = require('express');
const router = express.Router();
const controller = require('../controllers/pendientes')

router.get('/', controller.pendientes)

module.exports = router