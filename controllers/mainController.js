const db = require('../database/models');
const redirect = require('../helpers/redirect');
const mailHelp = require('../helpers/mailHelp');

const controller = {
	inicio: (req, res) => {
		let title_login = req.session.user ? 'Panel de cliente' : 'iniciar sesion' ;
		res.render("main/index", { title_login : title_login });
	},
	login: (req, res) => {
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
				res.render("main/login", { error : 'Usuario o clave inválido'});
		  	}
	
		})
  	},
  	nosotros: (req, res) => {
		let title_login = req.session.user ? 'Panel de cliente' : 'iniciar sesion' ;
		res.render("main/nosotros", { title_login});
  	},
  	precios: (req, res) => {
		let title_login = req.session.user ? 'Panel de cliente' : 'iniciar sesion' ;
		res.render("main/precios", { title_login});
  	},
  	destacados: (req, res) => {
		let title_login = req.session.user ? 'Panel de cliente' : 'iniciar sesion' ;
		res.render("main/destacados", { title_login});
  	},
  	cliente: (req, res) => {
		let title_login = req.session.user ? 'Panel de cliente' : 'iniciar sesion' ;
  	    res.render("main/cliente", {title_login});
  	},
  	contacto: (req, res) => {
		let title_login = req.session.user ? 'Panel de cliente' : 'iniciar sesion' ;
		res.render("main/contacto", { title_login});
	},
  	logout : (req, res) => {
		req.session.destroy();
		res.locals.user = {};
		delete res.locals;
		res.cookie('user', null, { maxAge: -1 });
		return res.redirect('/');
	},
	formulario : (req, res) => {
		let type = req.query.type;

		if(type == 'contacto'){
			mailHelp.contacto(req,res)
		}
		
		if(type == 'cliente'){
			mailHelp.cliente(req,res)
		}
	}
};

module.exports = controller;
