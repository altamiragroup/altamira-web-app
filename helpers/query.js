const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const catalogo = require('./catalogo');

module.exports = (req) => {
    // traer filtros desde la sesion
    const filters = req.session.filters;
    let {nuevos, destacados, lineas, rubros, busquedas} = filters;
    // array de filtros
    let items = [];
    // incluir filtros al array
    if(nuevos){
        items.push({nuevo : 1})
    }
    if(destacados){
        items.push({destacado : 1})
    }
    if(lineas.length > 0){
        let filtros = [];
        for(num of lineas){
            filtros.push({linea_id : num})
        }
        items.push({[Op.or] : filtros})
    }
    if(rubros.length > 0){
        let filtros = [];
        for(num of rubros){
            filtros.push({rubro_id : num})
        }
        items.push({[Op.or] : filtros})
    }
    if(busquedas.length > 0){
        let filtros = [];
        for(query of busquedas){
            let items = query.trim().split(" ")
            for(item of items){
                filtros.push({
                    [Op.or] : [
                        {codigo: {[Op.like]: '%'+ item +'%' }},
                        {oem: {[Op.like]: '%'+ item +'%' }},
                        {modelos: {[Op.like]: '%'+ item +'%' }},
                        {descripcion: {[Op.like]: '%'+ item +'%' }},
                        {caracteristicas: {[Op.like]: '%'+ item +'%' }},
                    ]
                })
            }
        }
        items.push(filtros)
    }
    // agregar array de filtros al where
    where = {
        [Op.and] : items
    }
    // paginacion
    let maxResults = 40;
    // recuperar num pagina desde la url
    const page = req.query.page != undefined ? req.query.page : 0;
    let offset = page != 0 ? maxResults * parseInt(page) : 0 ;
    let limit = maxResults;
    // query
    return db.articulos.findAll({
        where : where,
        order : [ 
            ['orden'],['linea_id'],['rubro_id'],['renglon'],['codigo']
        ],
        offset : offset,
		limit : limit,
        logging: false
    })
}