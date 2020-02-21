const db = require("../database/models");
const Sequelize = require("Sequelize")
const Op = Sequelize.Op;
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
            /* where : { 
                stock : {[Op.gte] : 1} 
                }, */
			offset : pagination.offset,
			limit : pagination.limit,
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