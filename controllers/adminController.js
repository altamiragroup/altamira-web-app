let db = require('../database/models');

module.exports = {
    panel : (req, res) =>{
        res.render('admin/panel')
    },
    clientes : (req, res) => {
        res.render('admin/clientes')
    },
    seguimiento : (req, res) => {
        res.render('admin/seguimiento')
    }
}