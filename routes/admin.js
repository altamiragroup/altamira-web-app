var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/panel', adminController.panel);
router.get('/clientes', adminController.clientes);
router.post('/seguimiento', adminController.seguimiento);

module.exports = router;
