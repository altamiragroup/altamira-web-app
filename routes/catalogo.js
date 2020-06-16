
const express = require("express");
const router = express.Router();
const controller = require("../controllers/catalogo");

const carrito = require('../middlewares/carrito');
const auth = require('../middlewares/auth');
const session = require('../middlewares/validarSesion');
const actualizar_carrito = require('../middlewares/actualizarCarrito');
const filtros = require('../middlewares/filtrosCatalogo');

router.use(filtros)

router.get("/", auth.invitado, carrito, controller.inicio);
router.post("/", auth.invitado, carrito, controller.inicio);
router.get("/filtro", auth.invitado, carrito, controller.filtro);
router.get("/resume", auth.cliente, actualizar_carrito, carrito, session.cliente, controller.resumen);
router.get("/resume/actualizar", auth.cliente, carrito, session.cliente, controller.actualizar);
router.get("/pendientes", auth.cliente, actualizar_carrito, carrito, session.cliente, controller.pendientes);
router.get("/relacionados", auth.cliente, carrito, session.cliente, controller.relacionados);
router.get("/finalizar", auth.cliente, actualizar_carrito, session.cliente, controller.finalizar);
router.post("/checkout", auth.cliente, actualizar_carrito, session.cliente, controller.checkout);
router.get("/detalle/:articuloId", auth.invitado, controller.detalle);

module.exports = router;
