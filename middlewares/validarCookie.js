const db = require('../database/models');

module.exports = (req, res, next) => {
    console.log('------ Validar Cookie ------');
    if(req.cookies.user){
        user = req.cookies.user;
        db.usuarios.findOne({ where : { id : user.id, tipo : user.tipo } })
        .then(user => {
            req.session.user = user;
            res.locals.user = user;
            delete res.locals.user.clave;
            console.log('---- cookie encontrada ----');
            console.log('Sesion tipo '+ user.tipo +' con id: '+ req.session.user.id )
            return next();
        })
    } else {
        return next();
    }
}    