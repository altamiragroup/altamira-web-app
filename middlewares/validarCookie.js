const db = require('../database/models');

module.exports = async (req, res, next) => {
    if(req.cookies.user){
        let user = req.cookies.user;
        try {
            let usuario = await db.usuarios.findOne({ 
                where : { id : user.id, tipo : user.tipo }, 
                logging: false 
            });
            if(usuario){
                delete user.clave;
                req.session.user = user;
                res.locals.user = user;
                return next();
            } else {
                throw 'Usuario no encontrado';
            }
        }
        catch(err){
            console.error({
                message : 'Error al validar cookie',
                err
            })
            res.locals.user = {
                tipo : 'invitado'
            }
            return next();
        }
    }
    else {
        res.locals.user = {
            tipo : 'invitado'
        }
        return next();
    }
}    