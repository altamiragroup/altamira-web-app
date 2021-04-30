"use strict";
const mongoose = require("../config/mongoose");
const Schema = mongoose.Schema;

const schemas = {
  cartSchema: new Schema({
    cliente: { type: Number, unique: true },
    actualizado: String,
    articulos: {
      type: [
        {
          codigo: String,
          linea: Number,
          cantidad: Number,
          min_vta: Number,
          stock: Number,
          precio: Number,
          descripcion: String,
        },
      ],
      default: [],
    },
    values: {
      descuento: Number,
      total: Number,
    },
  }),
};

module.exports = schemas;
