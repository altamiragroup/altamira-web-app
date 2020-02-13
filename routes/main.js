const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

/* GET home page. */
router.get('/', mainController.inicio);

router.get('/ingresar', mainController.login);
router.post('/ingresar', mainController.validarLogin);

router.get('/nosotros', mainController.nosotros);
router.get('/precios', mainController.precios);
router.get('/destacados', mainController.destacados);
router.get('/contacto', mainController.contacto);

module.exports = router;