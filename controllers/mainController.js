const db = require('../database/models');
const redirect = require('../helpers/redirect');
const controller = {
  inicio: (req, res, next) => {
    res.render("main/index", { title: "inicio" });
  },
  login: (req, res, next) => {
    let error = '';
    if(req.query.error){
      error = req.query.error;
    }
    res.render("main/login", { error });
  },
  validarLogin: (req,res) => {
    db.usuarios.findOne({ where : { usuario : req.body.usuario } })
    .then(user => {
      if(user.clave == req.body.clave){
        delete user.clave;
        req.session.user = user;
        res.locals.user = user;
        delete res.locals.user.clave;
        res.cookie('user', user, {maxAge: 1000 * 60 * 60 * 24 * 7});
        console.log('Sesion creada con id: '+ req.session.user_id);
        
        redirect(req,res);
      } else {
        res.send('error de login');
      }
      
    })
  },
  nosotros: (req, res, next) => {
    res.render("main/nosotros", { title: "Nosotros" });
  },
  precios: (req, res, next) => {
    res.render("main/precios", { title: "Precios" });
  },
  destacados: (req, res, next) => {
    res.render("main/destacados", { title: "Destacados" });
  },
  contacto: (req, res, next) => {
    res.render("main/contacto", { title: "Contacto" });
  },
  logout : (req, res, next) => {
    req.session.destroy();
    delete res.locals;
		res.cookie('user', null, { maxAge: -1 });
		return res.redirect('/');
  }
};

module.exports = controller;
