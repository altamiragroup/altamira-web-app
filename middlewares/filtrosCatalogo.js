const filtros = require('../helpers/filtros');

module.exports = (req, res, next) => {
    if(req.session.user.tipo == 'cliente'){
        if(!req.session.filters){
            filtros.crear(req)
        }
    }
    return next()
}