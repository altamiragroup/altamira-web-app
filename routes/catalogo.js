// require packages
const express = require("express");
const router = express.Router();
// require controller
const catalogoController = require("../controllers/catalogoController");

// asign routes
router.get("/", catalogoController.inicio);
router.get('/detalle/:articuloId', catalogoController.detalle);

router.get('/linea/:lineaId', catalogoController.linea);

router.get('/rubro/:rubroId', catalogoController.rubro);

router.get('/sub/:subId', catalogoController.sub_rubro);

module.exports = router;
