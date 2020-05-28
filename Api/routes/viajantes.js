const express = require('express');
const router = express.Router();
const controller = require('../controllers/viajantes');

router.get('/cobranzas/pdf', controller.listadoPDF)

module.exports = router