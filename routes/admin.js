var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/panel', adminController.panel);
router.get('/registro', adminController.registro)
router.post('/registro', adminController.setRegistro);


module.exports = router;
