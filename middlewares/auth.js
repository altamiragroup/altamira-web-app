module.exports = {
    cliente : (req, res, next) => {
        if(req.session.user == undefined || req.session.user == 'invitado'){
            return res.redirect('/ingresar?error=invalidUser');
        }
        return next()
    },
    invitado : (req, res, next) => {
        if(req.session.user == undefined){
            req.session.user = 'invitado';
        }
        return next()
    }

} 