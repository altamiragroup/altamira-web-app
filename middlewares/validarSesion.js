module.exports = {
    cliente : (req, res, next) => {
        console.log('------ Validar Sesion ------');
        if(req.session.user.tipo == 'cliente'){
            console.log('sesion de tipo ' + req.session.user.tipo + ' recuperada');

            return next()
        } else {
            res.send('No posees permisos para ver esta sección')
        }
    },
    viajante : (req, res, next) => {
        console.log('------ Validar Sesion ------');
        if(req.session.user.tipo == 'cliente'){
            console.log('sesion de tipo ' + req.session.user.tipo + ' recuperada');

            return next()
        } else {
            res.send('No posees permisos para ver esta sección')
        }
    },
    admin : (req, res, next) => {
        console.log('------ Validar Sesion ------');
        if(req.session.user.tipo == 'admin'){
            console.log('sesion de tipo ' + req.session.user.tipo + ' recuperada');

            return next()
        } else {
            res.send('No posees permisos para ver esta sección')
        }
    },
    recuperar : (req, res, next) => {
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
        } else {
            return next()
        }
    }
}