const express = require('express');
const router = express.Router();
const controller = require('../controllers/carritos')

router.get('/', controller.carritos)

module.exports = router