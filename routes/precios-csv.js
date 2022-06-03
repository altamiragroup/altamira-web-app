const express = require('express');
const router = express.Router();
const controller = require('../controllers/precios-csv');


router.get('/catalogo', controller.inicio);

module.exports = router;