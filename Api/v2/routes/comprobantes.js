const express = require('express');
const router = express.Router();
const controller = require('../controllers/comprobantes')

router.get('/', controller.comprobantes)

module.exports = router