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
		// create reusable transport method (opens pool of SMTP connections)
		var smtpTransport = nodemailer.createTransport("SMTP",{
		    service: "Gmail",
		    auth: {
		        user: "dkone2794@gmail.com",
		        pass: "dasker2110"
		    }
		});

		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
		    to: "ottoabarriosp@hotmail.com", // list of receivers
		    subject: "Hello ✔", // Subject line
		    text: "Hello world ✔", // plaintext body
		    html: "<b>Hello world ✔</b>" // html body
		}

		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        console.log("Message sent: " + response.message);
		    }
		
		    // if you don't want to use this transport object anymore, uncomment following line
		    smtpTransport.close(); // shut down the connection pool, no more messages
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
