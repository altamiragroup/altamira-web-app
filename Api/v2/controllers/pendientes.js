const db = require("../../../database/models");
const Sequelize = require("sequelize");

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
            if (!cuenta) {
                throw new Error('numero de cuenta invalido o nulo')
            }

            let pendientes = await db.pendientes.findAll({
                where : { cliente : cuenta },
                limit : limit ? limit : null,
                logging: false
            });
            if(pendientes.length == 0){
                return res
                .status(404)
                .json({
                    message : 'Sin resultados',
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
    stock: async (req, res) => {
        let cuenta = req.params.cuenta && parseInt(req.params.cuenta);

        if (cuenta == 'session' || Number.isNaN(cuenta)) {
            cuenta = req.session.user.numero;
        }

        try {
            if (!cuenta) {
                throw new Error("numero de cuenta invalido o nulo")
            }

            let pendientes = await db.pendientes.findAll({
                where : { cliente : cuenta },
                include: [{ model: db.articulos, as : 'articulos', attributes: ['stock'] }],
                logging: false
            });
            
            const enStock = pendientes.map(art => {
                if (art.articulos.length) {
                    const {stock} = art.articulos[0];

                    if (stock > art.cantidad) {
                        return {
                            id: art.id,
                            codigo: art.articulo
                        };
                    }
                }
            }).filter(x => x);

            return res.status(200).json(enStock)
        }
        catch(err){
            console.log(err);
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
           console.error('error al crear pendientes', err);
           return res
            .status(500)
            .json({
                message : 'Error',
                err
            }) 
        }
    },
    borrar : async (req, res) => {
        let cuenta = req.params.cuenta && parseInt(req.params.cuenta);

        if (cuenta === 'session' || Number.isNaN(cuenta)) {
            cuenta = req.session.user.numero;
        }

        let id = req.params.id && parseInt(req.params.id);
        
        try {
             if (!cuenta && !id) {
                throw new Error('no se recibio ningun numero de cuenta o id valido');
            }

            await db.pendientes.destroy({
                where : cuenta ? { cliente : cuenta } : { id : id },
                logging: false
            })

            return res.status(204)
        }
        catch(err){
            console.error('error al eliminar pendientes', err);
            return res
            .status(500)
            .json({
                message : 'Error',
                err
            })   
        }
    }
}
