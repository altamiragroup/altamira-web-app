const db = require('../../../database/models');
const sequelize = db.sequelize;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
    articulos : async (req, res) => {
        let limit = parseInt(req.query.limit);
        let {linea, rubro, oem, destacados, nuevos, buscar} = req.query;

        let query = [];
        let queryBusqueda = [];

        if(linea) query.push({linea_id : linea})
        if(rubro) query.push({rubro_id : linea})
        if(oem) query.push({oem : {[Op.like]: '%'+ oem +'%' }})
        if(destacados) query.push({destacado : 1})
        if(nuevos) query.push({nuevo : 1})
        if(buscar){
            let params = String(buscar).split('*');
            console.log(params)
            params.forEach(item => {
                query.push({
                    [Op.or] : [
                        {codigo: {[Op.like]: '%'+ item +'%' }},
                        {oem: {[Op.like]: '%'+ item +'%' }},
                        {modelos: {[Op.like]: '%'+ item +'%' }},
                        {descripcion: {[Op.like]: '%'+ item +'%' }}
                    ]
                })
            })
            query.push()
        }
        try {
            let articulos = await db.articulos.findAll({
                where : {
                    [Op.and] : query
                },
                order : [ 
                    ['orden'],['linea_id'],['rubro_id'],['renglon'],['codigo']
                ],
                limit : limit ? limit : null,
                logging: false
            });
            return res
            .status(200)
            .json(articulos)
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
    codigo : async (req, res) => {
        let codigo = req.params.codigo.replace('-','/')
        let comp = req.query.comp;
        let uses = req.query.uses;

        try {
            let articulo = await db.articulos.findOne({
                where : { codigo },
                logging: false,
                include : comp ?
                    [{ model: db.comprobantes, as : 'comprobantes', attributes : ['cliente_num','tipo','numero']}]
                    :
                    '',
                order : [ 
                ['orden'],['linea_id'],['rubro_id'],['renglon'],['codigo'],[['comprobantes','numero']]
                ],
                logging: false
            });
            let queryUses = []
            function traerUses(){
                let oem = articulo.oem.split('*');
                oem.forEach( item => { 
                    queryUses.push({oem: {[Op.like]: '%'+ item +'%' }}) 
                })
            }
            if(uses) traerUses();

            let usesArr = uses ? await db.articulos.findAll({
                    where : {
                        [Op.or] : queryUses
                    }
                })
                :
                [];

            if(uses){
                return res
                .status(200)
                .json({
                    articulo,
                    usesArr
                })
            } else {
                return res
                .status(200)
                .json(articulo)
            }
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