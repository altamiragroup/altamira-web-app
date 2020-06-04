const db = require("../../../database/models");
const sequelize = db.sequelize;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
    pendientes : async (req, res) => {
        let limit = parseInt(req.query.limit);

        try {
            let pendientes = await db.pendientes.findAll({
                limit : limit ? limit : null,
                logging: false
            });
            return res
            .status(200)
            .json(pendientes)
        }
        catch(err){
            return res
            .status(500)
            .json({
                message : 'Error',
                err
            })   
        }        
    },
    cuenta : async (req, res) => {
        let cuenta = req.params.cuenta;
        let limit = parseInt(req.query.limit);

        try {
            let pendientes = await db.pendientes.findAll({
                where : { cliente : cuenta },
                limit : limit ? limit : null,
                logging: false
            });
            return res
            .status(200)
            .json(pendientes)
        }
        catch(err){
            return res
            .status(500)
            .json({
                message : 'Error',
                err
            })   
        }    
    }
}