const express = require('express')
const router = express.Router()
const controller = require('../controllers/carrito')

router.get('/articulos', controller.articulos)
router.get('/agregar', controller.agregar)
router.get('/eliminar', controller.eliminar)

module.exports = router