const express = require('express');
const router = express.Router();
const controller = require('../controllers/rubros')

router.get('/', controller.rubros)

module.exports = router