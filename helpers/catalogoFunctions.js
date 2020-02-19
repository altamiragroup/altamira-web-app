// recibe el objeto req y devuelve la url con el filtro borrado
const filters = require('../helpers/filtersHelper');

module.exports = {
    deleteFilter : (req,res) => {
	    if(req.query.delete){
	      let urlFinal = filters.destroyFilter(req);
	      return res.redirect('/catalogo/' + urlFinal + '/')
	    }
    },
	pagination : (actualPage) => {
        let maxResults = 12;
        let offset = actualPage != 0 ? maxResults * parseInt(actualPage) : 0 ;
        console.log('resultados desde el #: ' + offset)
        let limit = maxResults;
        console.log('hasta el #: ' + (offset + limit))

        return {
            offset : offset,
            limit : limit,
        }
    }
}