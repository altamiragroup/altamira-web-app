const express = require('express');
const router = express.Router();
const redirect = require('../middlewares/redirect').redireccion;

const controller = require('../controllers/main');

/* GET home page. */
router.get('/', controller.inicio);
router.post('/', controller.formulario);

router.get('/ingresar', redirect, controller.login);
router.post('/ingresar', controller.validarLogin);

router.get('/nosotros', controller.nosotros);
router.get('/precios', controller.precios);
router.get('/destacados', controller.destacados);

router.get('/contacto', controller.contacto);
router.post('/contacto', controller.formulario);

router.get('/cliente', controller.cliente);
router.post('/cliente', controller.formulario);

router.get('/logout', controller.logout);

module.exports = router;