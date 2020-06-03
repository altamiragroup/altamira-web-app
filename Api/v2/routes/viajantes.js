const express = require('express');
const router = express.Router();
const controller = require('../controllers/viajantes')

router.get('/', controller.viajantes)

module.exports = router