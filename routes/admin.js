var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/panel', adminController.panel);
router.post('/panel', adminController.registro);

router.get('/clientes', adminController.clientes);
router.post('/seguimiento', adminController.seguimiento);

module.exports = router;
