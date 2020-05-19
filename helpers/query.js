const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const catalogo = require('./catalogo');

module.exports = (req) => {
    // busqueda viene por post
    const busqueda = req.query.busqueda;
    // datos de filtro
    const tipo = req.query.filter;
    const param = req.query.param;
    // filtros de la sesion
    const filters = req.session.filters;
    // ingresar filtros a la sesion
    if(tipo == 'linea'){
        let index = filters.lineas.indexOf(param);
        if(index == -1){
            filters.lineas.push(param)
        }
        if(req.query.borrar){
            filters.lineas.splice(index, 1)
        }
    }
    if(tipo == 'rubro'){
        let index = filters.rubros.indexOf(param)
        if(index == -1){
            filters.rubros.push(param)
        }
        if(req.query.borrar){
            filters.rubros.splice(index, 1)
        }
    }
    if(busqueda || tipo == 'busqueda'){
        let index = filters.busquedas.indexOf(param)
        if(index == -1){
            filters.busquedas.push(busqueda)
        }
        if(req.query.borrar){
            filters.busquedas.splice(index, 1)
        }
    }
    if(tipo == 'nuevos'){
        if(filters.nuevos == 0){
            filters.nuevos = 1
        }
        if(req.query.borrar){
            filters.nuevos = 0
        }
    }
    if(tipo == 'destacados'){
        if(filters.destacados == 0){
            filters.destacados = 1
        }
        if(req.query.borrar){
            filters.destacados = 0
        }
    }
    // traer filtros desde la sesion
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