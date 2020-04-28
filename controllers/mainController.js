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
		// async..await is not allowed in global scope, must use a wrapper
		async function main() {
		  // Generate test SMTP service account from ethereal.email
		  // Only needed if you don't have a real mail account for testing
		  let testAccount = await nodemailer.createTestAccount();
		
		  // create reusable transporter object using the default SMTP transport
		  let transporter = nodemailer.createTransport({
		    host: "smtp.ethereal.email",
		    port: 587,
		    secure: false, // true for 465, false for other ports
		    auth: {
		      user: testAccount.user, // generated ethereal user
		      pass: testAccount.pass // generated ethereal password
		    }
		  });
	  
		  // send mail with defined transport object
		  let info = await transporter.sendMail({
		    from: '"Fred Foo 👻" <foo@example.com>', // sender address
		    to: "ottoabarriosp@hotmail.com", // list of receivers
		    subject: "Hello ✔", // Subject line
		    text: "Hello world?", // plain text body
		    html: "<b>Hello world?</b>" // html body
		  });
	  
		  console.log("Message sent: %s", info.messageId);
		  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	  
		  // Preview only available when sending through an Ethereal account
		  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		}

		main().catch(console.error);
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
