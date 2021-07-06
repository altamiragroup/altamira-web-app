const express = require('express');
const router = express.Router();
const controller = require('../controllers/pendientes')

router.get('/', controller.pendientes);
router.get('/:cuenta', controller.cuenta);
router.get('/:cuenta/stock', controller.stock);
router.post('/', controller.nuevo);
router.delete('/:id', controller.borrar);
router.delete('/cuenta/:cuenta', controller.borrar);

module.exports = router
