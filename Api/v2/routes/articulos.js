const express = require('express');
const router = express.Router();
const controller = require('../controllers/articulos')

router.get('/', controller.articulos)
router.get('/:codigo', controller.codigo)
router.get('/:codigo/costo1', controller.costo1)
router.get('/actualizar_stock', controller.actualizarStock)

module.exports = router