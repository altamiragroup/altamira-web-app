const db = require("../database/models");
const Sequelize = require("Sequelize")
const Op = Sequelize.Op;


module.exports = (req) => {
    
    const params = req.params;
    // creamos una variable where con un objeto donde le vamos a ir sumando los filtros
    let where = { 
        // aqui se van sumando los filtros
    }; 

    if(req.query.search_parameter != undefined){
        
        let query = (req.query.search_parameter).trim();

        where = { 
            stock : {[Op.gte] : 1},
            [Op.or]: [
                {codigo: {[Op.like]: '%'+query+'%' }},
                {modelos: {[Op.like]: '%'+query+'%' }},
                {descripcion: {[Op.like]: '%'+query+'%' }},
                {caracteristicas: {[Op.like]: '%'+query+'%' }},
            ],
        };

    } else {
        where.stock = {[Op.gte] : 1} 
    }
    if(params.lineaId && params.rubroId == undefined && params.subId == undefined){
        // articulos filtrados por linea 
        where.linea_id = params.lineaId;        
    }
    if(params.rubroId && params.lineaId == undefined && params.subId == undefined){
        // articulos filtrados por rubro     
        where.rubro_id = params.rubroId;
    }
    if(params.subId && params.lineaId == undefined && params.rubroId == undefined){
        // articulos filtrados por sub rubro      
        where.sub_rubro_id = params.subId;
    }
    if(params.lineaId && params.rubroId && params.subId == undefined){
        // articulos filtrados por linea y rubro
        where.linea_id = params.lineaId;        
        where.rubro_id = params.rubroId;
    }
    if(params.lineaId && params.subId && params.rubroId == undefined){
        // articulos filtrados por linea y sub rubro
        where.linea_id = params.lineaId;        
        where.rubro_id = params.subId;
    }
    if(params.lineaId && params.rubroId && params.subId){
        // articulos filtrados por linea, rubro y sub rubro
        where.linea_id = params.lineaId;        
        where.rubro_id = params.rubroId;
        where.linea_id = params.subId;        
    }
    // retornamos el objeto where con los filtros guardados en la variable
    return db.articulos.findAll({
            where : where
        })
}