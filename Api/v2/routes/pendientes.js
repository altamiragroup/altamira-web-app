const express = require('express');
const router = express.Router();
const controller = require('../controllers/pendientes')

router.get('/', controller.pendientes)
router.get('/:cuenta', controller.cuenta)
router.post('/', controller.nuevo)

module.exports = router