var express = require('express');
var router = express.Router();
const clienteController = require("../controllers/clienteController");


router.get('/perfil', clienteController.perfil);

module.exports = router;
