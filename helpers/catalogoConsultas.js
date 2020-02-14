const db = require("../database/models");
const Sequelize = require("Sequelize")
const Op = Sequelize.Op;

module.exports = {
    articulos : db.articulos.findAll({  where : { stock : {[Op.gte] : 1} } }),
    lineas : db.lineas.findAll(),
    rubros : db.rubros.findAll(),
    //subrubros : db.sub_rubros.findAll(),
    articulosLinea : (req) => {
        return db.articulos.findAll({ where: { linea_id : req.params.lineaId, stock : {[Op.gte] : 1} } })
    },
    articulosRubro : (req) => {
        return db.articulos.findAll({ where: { rubro_id : req.params.rubroId, stock : {[Op.gte] : 1} } })
    }

}