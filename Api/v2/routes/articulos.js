const express = require('express');
const router = express.Router();
const controller = require('../controllers/articulos')

router.get('/', controller.articulos)
router.get('/:codigo', controller.codigo)
router.get('/:codigo/componentes', controller.componentes)
router.get('/actualizar_stock', controller.actualizarStock)

module.exports = router