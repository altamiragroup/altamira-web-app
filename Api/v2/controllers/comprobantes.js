const db = require("../../../database/models");
const sequelize = db.sequelize;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
    comprobantes : async (req, res) => {
        let tipo = req.query.tipo;
        let limit = parseInt(req.query.limit);
        
        try {
            let comprobantes = await db.comprobantes.findAll({ 
                where : {
                    tipo : tipo ? { [Op.like] : '%'+ tipo +'%' } : { [Op.like] : '% %' }
                }, 
                limit : limit ? limit : null,
                logging: false 
            });
            return res
            .status(200)
            .json(comprobantes)
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
    detalle : async (req, res) => {
        let numero = parseInt(req.params.numero);
        let tipo = req.query.tipo;
        let fulldata = req.query.fulldata;
        
        try {
            let comprobante = await db.comprobantes.findAll({ 
                where : {
                    numero : numero,
                    tipo : tipo ? { [Op.like] : '%'+ tipo +'%' }  : { [Op.like] : '% %' },
                },
                include : fulldata ? [ { model: db.clientes , as : 'cliente' } ] : '',
                logging: false 
            })
            let query;

            if(tipo === 'factura'){
                query = `
                SELECT comp_articulo.articulo_id, comp_articulo.cantidad, comp_articulo.precio, comp_articulo.despacho, articulos.descripcion, articulos.modelos
                FROM comp_articulo
                JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
                WHERE numero = ${numero}
                `
            } else {
                 query = `
                SELECT comp_articulo.articulo_id, comp_articulo.cantidad, comp_articulo.precio, comp_articulo.descripcion
                FROM comp_articulo
                LEFT JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
                WHERE numero = ${numero}
                `
            }
            let [articulos, meta] = await sequelize.query(query);
            
            let data = fulldata ? { comprobante, articulos } : comprobante;
            return res
            .status(200)
            .json(data)
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
        let cuenta = parseInt(req.params.cuenta);
        let limit = parseInt(req.query.limit);
        let tipo = req.query.tipo;

        try {
            let comprobantes = await db.comprobantes.findAll({ 
                where : {
                    cliente_num : cuenta,
                    tipo : tipo ? { [Op.like] : '%'+ tipo +'%' } : { [Op.like] : '% %' },
                }, 
                limit : limit ? limit : null,
                order : [ ['fecha','DESC']],
                logging: false 
            });
            return res
            .status(200)
            .json(comprobantes)
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
    pago : async (req, res) => {
        
        try {

        }
        catch(err){

        }

    }
}