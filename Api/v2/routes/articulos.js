const express = require('express');
const router = express.Router();
const controller = require('../controllers/articulos')

router.get('/', controller.articulos)
router.get('/:codigo', controller.codigo)

module.exports = router