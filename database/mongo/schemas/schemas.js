'use strict';
const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const schemas = {
    cartSchema: new Schema({
        cliente : { type: Number, unique: true },
        actualizado : String,
        articulos : [],
        values : {
            descuento : Number,
            total : Number
        }
    })
}

module.exports = schemas;