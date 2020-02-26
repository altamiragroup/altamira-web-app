const db = require('../database/models');
const filters = require('../helpers/filtersHelper');

module.exports = {
    deleteFilter : (req,res) => {
	    if(req.query.delete){
	      let urlFinal = filters.destroyFilter(req);
	      return res.redirect('/catalogo/' + urlFinal + '/')
	    }
    },
	pagination : (actualPage) => {
        let maxResults = 40;
        let offset = actualPage != 0 ? maxResults * parseInt(actualPage) : 0 ;
        let limit = maxResults;

        return {
            offset : offset,
            limit : limit,
        }
    },
    fechaActual : () => {
        let fecha = new Date()

        let dd = fecha.getDate();
        let mm = fecha.getMonth() + 1;
        let yyyy = fecha.getFullYear();

        let fechaAct = dd + '/' + mm + '/' + yyyy
        return fechaAct
    },
    traerPendientes : (req) => {

        return db.clientes.findAll({
            where : {
                numero : req.session.user.numero
            },attributes : ['numero']
            ,include : ['articulos']
        })

    },
    borrarPendiente : (art,cant,res) => {
        db.pendientes.destroy({
            where : {
                articulo : art
            }
        }) .then(result => {
            return res.redirect('?agregar_articulo=' + art + '&cant=' + cant)
        })
    }
}