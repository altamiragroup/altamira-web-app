// require packages
const express = require("express");
const router = express.Router();
// require controller
const catalogoController = require("../controllers/catalogoController");

// asign routes
router.get("/", catalogoController.inicio);

router.get('/linea/:lineaId', catalogoController.linea);
router.get('/linea/:lineaId/rubro/:rubroId', catalogoController.linea);
router.get('/linea/:lineaId/subrubro/:subId', catalogoController.linea);
router.get('/linea/:lineaId/rubro/:rubroId/subrubro/:subId', catalogoController.linea);

router.get('/rubro/:rubroId', catalogoController.rubro);
router.get('/rubro/:rubroId/linea/:lineaId', catalogoController.rubro);
router.get('/rubro/:rubroId/linea/:lineaId/subrubro/:subId', catalogoController.rubro);
router.get('/rubro/:rubroId/subrubro/:subId', catalogoController.rubro);
router.get('/rubro/:rubroId/subrubro/:subId/linea/:lineaId', catalogoController.rubro);

router.get('/subrubro/:subId', catalogoController.sub_rubro);
router.get('/subrubro/:subId/linea/:lineaId', catalogoController.sub_rubro);
router.get('/subrubro/:subId/linea/:lineaId/rubro/:rubroId', catalogoController.sub_rubro);
router.get('/subrubro/:subId/rubro/:rubroId', catalogoController.sub_rubro);
router.get('/subrubro/:subId/rubro/:rubroId/linea/:lineaId', catalogoController.sub_rubro);

router.get('/detalle/:articuloId', catalogoController.detalle);

module.exports = router;
