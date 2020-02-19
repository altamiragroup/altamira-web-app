
const express = require("express");
const router = express.Router();
const cartValidation = require('../middlewares/cartValidation');

const catalogoController = require("../controllers/catalogoController");


router.get("/", cartValidation ,catalogoController.inicio);
router.get("/resume", cartValidation ,catalogoController.resumen);
router.get("/checkout", cartValidation ,catalogoController.finalizar);

router.get('/linea/:lineaId', cartValidation ,catalogoController.linea);
router.get('/linea/:lineaId/rubro/:rubroId', cartValidation ,catalogoController.linea);
router.get('/linea/:lineaId/subrubro/:subId', cartValidation ,catalogoController.linea);
router.get('/linea/:lineaId/rubro/:rubroId/subrubro/:subId', cartValidation ,catalogoController.linea);

router.get('/rubro/:rubroId', cartValidation ,catalogoController.rubro);
router.get('/rubro/:rubroId/linea/:lineaId', cartValidation ,catalogoController.rubro);
router.get('/rubro/:rubroId/linea/:lineaId/subrubro/:subId', catalogoController.rubro);
router.get('/rubro/:rubroId/subrubro/:subId', cartValidation ,catalogoController.rubro);
router.get('/rubro/:rubroId/subrubro/:subId/linea/:lineaId', cartValidation ,catalogoController.rubro);

router.get('/subrubro/:subId', cartValidation ,catalogoController.sub_rubro);
router.get('/subrubro/:subId/linea/:lineaId', cartValidation ,catalogoController.sub_rubro);
router.get('/subrubro/:subId/linea/:lineaId/rubro/:rubroId', cartValidation ,catalogoController.sub_rubro);
router.get('/subrubro/:subId/rubro/:rubroId', cartValidation ,catalogoController.sub_rubro);
router.get('/subrubro/:subId/rubro/:rubroId/linea/:lineaId', cartValidation ,catalogoController.sub_rubro);

router.get('/detalle/:articuloId', catalogoController.detalle);

module.exports = router;
