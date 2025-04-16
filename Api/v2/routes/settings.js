const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings'); // Ajusta el path según tu estructura

router.get('/', settingsController.index); // Asegúrate de que settingsController.index esté definido y exportado

module.exports = router;