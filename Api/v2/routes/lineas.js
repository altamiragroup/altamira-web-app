const express = require('express');
const router = express.Router();
const controller = require('../controllers/lineas')

router.get('/', controller.lineas)

module.exports = router