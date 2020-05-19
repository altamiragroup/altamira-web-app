const db = require('../database/models');

module.exports = (req, res, next) => {
    if(req.cookies.user){
        user = req.cookies.user;
        db.usuarios.findOne({ where : { id : user.id, tipo : user.tipo }, logging: false })
        .then(user => {
            req.session.user = user;
            res.locals.user = user;
            delete res.locals.user.clave;

            return next();
        })
    } else {
        res.locals.user = {
            tipo : 'invitado'
        }
        return next();
    }
}    