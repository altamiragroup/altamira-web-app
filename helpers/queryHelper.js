const db = require("../database/models");
const Sequelize = require("Sequelize")
const Op = Sequelize.Op;
const queryFiltros = require('./queryFiltros')


module.exports = {
    
    general : (req) => {

        if(req.query.search_parameter != undefined){

            return queryFiltros(req);
            
        } else {

            return db.articulos.findAll({
            where : { 
                stock : {[Op.gte] : 1} 
                } 
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