const db = require("../database/models");
const sequelize = db.sequelize;
const pdf = require("html-pdf");
const compRequest = require('../requests/src/comprobantes');

const controller = {
    panel : (req, res) => {

        res.render('viajantes/perfil')
    },
    clientes : (req, res) => {

        res.render('viajantes/clientes')
    },
    cobranzas : (req, res) => {

        res.render('viajantes/cobranzas')
    },
    seguimiento : (req, res) => {

        res.render('viajantes/pedidos')
    }
}

module.exports = controller;