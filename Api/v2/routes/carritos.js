const express = require('express');
const router = express.Router();
const controller = require('../controllers/carritos')

router.get('/', controller.carritos)
router.get('/articulos', controller.articulos)
router.get('/agregar', controller.agregar)
router.get('/actualizar', controller.actualizar)
router.get('/eliminar', controller.eliminar)
router.get('/filtros', controller.filtros)

module.exports = router