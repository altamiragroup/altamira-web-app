module.exports = {

    cliente : (req,res,next) => {

        if(req.session.user == undefined){
            return res.redirect('/ingresar?error=invalidUser');
        }

        return next()
    }

} 