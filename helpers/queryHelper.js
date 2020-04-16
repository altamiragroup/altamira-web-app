const db = require("../database/models");
const Sequelize = require("sequelize");
const queryFiltros = require('./queryFiltros')
const functions = require('../helpers/catalogoFunctions');

module.exports = {
    
    general : (req) => {
        let page = req.query.page != undefined ? req.query.page : 0;
        let pagination = functions.pagination(page);

        if(req.query.search_parameter != undefined){

            return queryFiltros(req);
            
        } else {

            return db.articulos.findAll({
            order : [
                ['orden'],
                ['linea_id'],
                //['subrubro'],
                ['renglon'],
                ['codigo']
            ],
            offset : pagination.offset,
			limit : pagination.limit
            })
        }
    },
    linea : (req) => {
        
	    let numFilters = Object.keys(req.params).length;

	    if (numFilters > 0){
            return queryFiltros(req);
	    }
    },
    rubro : (req) => {

	    let numFilters = Object.keys(req.params).length;

	    if (numFilters > 0){
	    	return queryFiltros(req);
	    }
    },

}