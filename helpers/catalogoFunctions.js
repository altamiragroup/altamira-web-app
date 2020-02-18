// recibe el objeto req y devuelve la url con el filtro borrado
const filters = require('../helpers/filtersHelper');

module.exports = {
    deleteFilter : (req,res) => {
	    if(req.query.delete){
	      let urlFinal = filters.destroyFilter(req);
	      return res.redirect('/catalogo/' + urlFinal + '/')
	    }
    }
}