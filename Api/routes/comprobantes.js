const express = require("express");
const router = express.Router();
const apiController = require('../controllers/comprobantes')

router.get('/', apiController.comprobantes)
router.get('/:id', apiController.detalle)
router.get('/cliente/:cliente', apiController.cliente)
router.get('/tipo/:tipo', apiController.tipo)

module.exports = router;