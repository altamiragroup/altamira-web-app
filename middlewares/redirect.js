module.exports = {
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