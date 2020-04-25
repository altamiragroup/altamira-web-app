const express = require('express');
const router = express.Router();
const validarSesion = require('../middlewares/validarSesion');

const mainController = require('../controllers/mainController');

/* GET home page. */
router.get('/', mainController.inicio);

router.get('/ingresar', validarSesion.redireccion, mainController.login);
router.post('/ingresar', mainController.validarLogin);

router.get('/nosotros', mainController.nosotros);
router.get('/precios', mainController.precios);
router.get('/destacados', mainController.destacados);

router.get('/contacto', mainController.contacto);
router.post('/contacto/send', mainController.send);

router.get('/cliente', mainController.cliente);
router.get('/logout', mainController.logout);

module.exports = router;