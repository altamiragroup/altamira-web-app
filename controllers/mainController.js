const db = require('../database/models');

const controller = {
  inicio: (req, res, next) => {
    res.render("main/index", { title: "inicio" });
  },
  login: (req, res, next) => {
    res.render("main/login", { title: "Ingresar" });
  },
  validarLogin: (req,res) => {
    db.usuarios.findOne({
      when : {
        usuario : req.body.usuario,
      }
    }) .then(user => {
      if(user.clave == req.body.clave){
        delete user.clave;
        req.session.user_id = user.id;
        req.session.user_type = user.tipo;
        console.log('Sesion creada con id: '+ req.session.user_id);
        
        res.cookie('user', user, {maxAge: 1000 * 60 * 60 * 24 * 7});

        res.redirect('/clientes/perfil')
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
};

module.exports = controller;
