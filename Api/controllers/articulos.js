const db = require("../../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
    articulos : (req, res) => {
        let query = req.query.search;

        let where = {};
        let limit;

        if (req.query.search) {
          where = {
            [Op.or]: [
                { codigo: { [Op.like]: "%" + query + "%" } },
                { modelos: { [Op.like]: "%" + query + "%" } },
                { descripcion: { [Op.like]: "%" + query + "%" } },
                { caracteristicas: { [Op.like]: "%" + query + "%" } },
            ],
          }
        }
        if(req.query.limit){
            limit = parseInt(req.query.limit)
        }
        db.articulos.findAll({
            where,
            limit
        })
        .then((response) => {
            res.json({
                status_code: res.statusCode,
                colletion : 'Articulos',
                total_items : response.length,
                response,
            });
        })
        .catch((error) => console.log(error));
    },
    articulo : (req, res) => {
        let params = req.params.id.replace('-','/');
        
        db.articulos.findOne({
            where : {
                codigo : params
            }
        })
        .then( response => {
            res.json({
                status_code : res.statusCode,
                response
            })
        })
        .catch(error => console.log(error))
    }
}