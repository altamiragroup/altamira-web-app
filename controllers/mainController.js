const db = require('../database/models');
const redirect = require('../helpers/redirect');
const mailHelp = require('../helpers/mailHelp');
const nodemailer = require("nodemailer");

const controller = {
	inicio: (req, res) => {
		let title_login = req.session.user ? 'Panel de cliente' : 'iniciar sesion' ;
		res.render("main/index", { title_login : title_login });
	  },
	formulario : (req, res) => {
		let { nombre, empresa, localidad, telefono, mensaje } = req.body;

		let transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});
		transporter.sendMail({
			from: '"Altamira Group" info@webapp.altamiragroup.com.ar',
			replyTo: 'info@altamiragroup.com.ar',
			to: 'ottoabarriosp@hotmail.com',
			subject: 'Contacto vía web',
			envelope: {
				from: 'Altamira Group <info@webapp.altamiragroup.com.ar>', // used as MAIL FROM: address for SMTP
				to: 'ottoabarriosp@hotmail.com' // used as RCPT TO: address for SMTP
			},
			html: `
			<h1> Contacto </h1>
			<p>Nombre: ${nombre}</p> \n
			<p>Empresa: ${empresa}</p> \n
			<p>Localidad: ${localidad}</p> \n
			<p>Telefono: ${telefono}</p> \n
			<p>Mensaje: ${mensaje}</p> \n
			\n
			\n
			<img src="http://webapp.altamiragroup.com.ar/images/logos/logoaltamira.png" style="width:80px">
			`
		}, (err, info) => {
			console.log(info.envelope);
			console.log(info.messageId);
			res.redirect('/')
		});
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
				res.send('error de login');
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
	send : (req, res) => {
		mailHelp.sendEmail()
		res.send('Enviado')
	},
  	logout : (req, res) => {
		req.session.destroy();
		delete res.locals;
			res.cookie('user', null, { maxAge: -1 });
			return res.redirect('/');
  	}
};

module.exports = controller;
