
const express = require("express");
const router = express.Router();
const cartValidation = require('../middlewares/cartValidation');
const auth = require('../middlewares/auth');

const catalogoController = require("../controllers/catalogoController");


router.get("/", cartValidation, catalogoController.inicio);
router.get("/resume", auth.cliente, cartValidation, catalogoController.resumen);
router.get("/pendientes", auth.cliente, cartValidation, catalogoController.pendientes);
router.get("/relacionados", auth.cliente, cartValidation, catalogoController.relacionados);
router.get("/finalizar", auth.cliente, cartValidation, catalogoController.finalizar);
router.get("/checkout", auth.cliente, cartValidation, catalogoController.checkout);

router.get('/linea/:lineaId', cartValidation, catalogoController.linea);
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
