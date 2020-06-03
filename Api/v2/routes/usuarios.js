const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios')

router.get('/', controller.usuarios)

module.exports = router