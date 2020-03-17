const express = require("express");
const router = express.Router();
const apiController = require('./controller')

// trae todos los comprobantes de un cliente
router.get('/comprobantes/cliente/:cliente', apiController.general)
// trae un comprobante especifico de un cliente
router.get('/comprobantes/cliente/:cliente/:numero', apiController.detalle)
// trae todos los comprobantes de un mismo tipo
router.get('/comprobantes/tipo/:tipo', apiController.tipo)
// trae todos los comprobantes de un mismo tipo y cliente
router.get('/comprobantes/tipo/:tipo/:cliente', apiController.tipo)
// trae un comprobante especifico
router.get('/comprobantes/tipo/:tipo/numero/:numero', apiController.tipo)

module.exports = router;