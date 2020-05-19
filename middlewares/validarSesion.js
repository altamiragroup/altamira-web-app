module.exports = {
    cliente : (req, res, next) => {
        if(req.session.user.tipo == 'cliente'){
            return next()
        } else {
            res.send('No posees permisos para ver esta sección')
        }
    },
    viajante : (req, res, next) => {
        if(req.session.user.tipo == 'viajante'){
            return next()
        } else {
            res.send('No posees permisos para ver esta sección')
        }
    },
    admin : (req, res, next) => {
        if(req.session.user.tipo == 'admin'){
            return next()
        } else {
            res.send('No posees permisos para ver esta sección')
        }
    },
    redireccion : (req, res, next) => {
        if(req.session.user){
            if(req.session.user.tipo == 'admin'){
                return res.redirect('/admin/panel');
            }
            if(req.session.user.tipo == 'cliente'){
                return res.redirect('/clientes/perfil');
            }
            if(req.session.user.tipo == 'viajante'){
                return res.redirect('/viajantes/perfil');
            }
            if(req.session.user.tipo == 'invitado'){
                return next()
            }
        }
        return next()
    }
}