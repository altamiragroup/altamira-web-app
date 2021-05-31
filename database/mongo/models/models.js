'use strict';
const mongoose = require('../config/mongoose');
const cartSchema = require('../schemas/schemas').cartSchema;

const models = {
  Cart: mongoose.model('cart', cartSchema),
};

module.exports = models;
