const express = require('express');
const router = express.Router();
const redirect = require('../middlewares/redirect').redireccion;

const controller = require('../controllers/main');

// capturar rutas de la pagina anterior
router.get(/\/(index.php*)|(.*php.*)/g, (req, res) => {
    return res.redirect('/')
});

router.get('/', controller.inicio);
router.post('/', controller.formulario);

router.get('/ingresar', redirect, controller.login);
router.post('/ingresar', controller.validarLogin);
router.get('/recuperar', redirect, controller.recuperar);
router.post('/recuperar', redirect, controller.recuperar);

router.get('/nosotros', controller.nosotros);
router.get('/precios', controller.precios);
router.get('/precios/pdf', controller.precios_pdf);

router.get('/destacados', controller.destacados);
router.get('/destacadosCp', controller.destacadosCp);

router.get('/contacto', controller.contacto);
router.post('/contacto', controller.formulario);

router.get('/cliente', controller.cliente);
router.post('/cliente', controller.formulario);

router.get('/logout', controller.logout);

module.exports = router;