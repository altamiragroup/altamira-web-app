const db = require('../database/models');
const Sequelize = require("sequelize")
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

        let yyyy = fecha.getFullYear();
        let mm = fecha.getMonth() + 1;
        let dd = fecha.getDate();
        
        let hh = fecha.getHours();
        let mmm = fecha.getMinutes();
        let sss = fecha.getSeconds();

        let fechaAct = `${yyyy}-${mm}-${dd} ${hh}:${mmm}:${sss}`
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
    actualizarPendientes : (art,cant,action,res) => {
        db.pendientes.destroy({
            where : {
                articulo : art
            }
        }) .then(result => {
            if(action == 'agregar'){
                return res.redirect('?agregar_articulo=' + art + '&cant=' + cant)
            }
        })
    }
}