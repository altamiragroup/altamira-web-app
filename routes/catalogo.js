// require packages
const express = require("express");
const router = express.Router();
// require controller
const catalogoController = require("../controllers/catalogoController");

// asign routes
router.get("/", catalogoController.inicio);

module.exports = router;
