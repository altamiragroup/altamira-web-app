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
            if(pendientes.length == 0){
                return res
                .status(404)
                .json({
                    message : 'Error',
                    ultimo_cliente : 'el ultimo cliente es el 7000',
                    ruta : 'www.google.com'
                }) 
            }
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
    nuevo : async (req, res) => {
        let multiple = req.query.multiple;
        let pendientes = req.body.pendientes;
        let { cliente, articulo, cantidad } = req.body;
        try {
            let nuevoPendiente = multiple ?
                await db.pendientes.bulkCreate(pendientes)
                :
                await db.pendientes.create({
                    cliente,
                    articulo,
                    cantidad
                })
            return res
            .status(201)
            .json(nuevoPendiente)
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