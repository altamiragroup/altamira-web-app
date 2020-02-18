let db = require('../database/models');
let sequelize = db.sequelize;

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