
const express = require("express");
const router = express.Router();
const opCarrito = require('../middlewares/operacionesCarrito');
const auth = require('../middlewares/auth');
const session = require('../middlewares/validarSesion');
const actCarrito = require('../middlewares/actualizarCarrito');
const controller = require("../controllers/catalogoController");
const cacheControl = require('../middlewares/cache');

router.get("/",cacheControl, auth.invitado, opCarrito, controller.inicio);
router.post("/",cacheControl, auth.invitado, opCarrito, controller.inicio);
router.get("/filtro", auth.invitado, opCarrito, controller.filtro);
router.get("/resume",cacheControl, auth.cliente, actCarrito, opCarrito, session.cliente, controller.resumen);
router.get("/resume/actualizar", auth.cliente, opCarrito, session.cliente, controller.actualizar);
router.get("/pendientes", auth.cliente, actCarrito, opCarrito, session.cliente, controller.pendientes);
router.get("/relacionados", auth.cliente, opCarrito, session.cliente, controller.relacionados);
router.get("/finalizar", auth.cliente, actCarrito, session.cliente, controller.finalizar);
router.post("/checkout", auth.cliente, actCarrito, session.cliente, controller.checkout);
router.get("/detalle/:articuloId", auth.invitado, controller.detalle);

module.exports = router;
