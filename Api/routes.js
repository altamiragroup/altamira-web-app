const express = require("express");
const router = express.Router();
const apiController = require('./controller')

router.get('/comprobantes/credito', apiController.credito)

module.exports = router;