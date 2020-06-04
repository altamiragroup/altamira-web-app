const db = require('../../../database/models');

module.exports = {

    pedidos : async (req, res) => {

        let articulos = req.query.articulos;
        let cuenta = req.query.cuenta;

        try {
            let pedidos = await db.pedidos.findAll({
                where : cuenta ? { cliente_id : cuenta } : { },
                logging: false,
                include : articulos ? [{ 
                    model: db.articulos, 
                    as: 'articulos',
                    attributes : ['codigo','oem','modelos','descripcion','precio']
                }] : '',
            });
            return res
            .status(200)
            .json({ pedidos })
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
        let id = req.params.id;
        let articulos = req.query.articulos;

        try {
            let pedido = await db.pedidos.findAll({
                where : { id },
                include : articulos ? [{ 
                    model: db.articulos, 
                    as: 'articulos',
                    attributes : ['codigo','oem','modelos','descripcion','precio']
                }] : '',
                logging: false
            })
            return res
            .status(200)
            .json({ pedido })
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
    nuevo : (req, res) => {

    },
    eliminar : async (req, res) => {
        let id = req.params.id;

        try {
            let pedido = await db.pedidos.destroy({
                where : { id },
                logging: false
            })
            return res.status(204)
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