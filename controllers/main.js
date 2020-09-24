const db = require('../database/models');
const redirect = require('../helpers/redirect');
const mailHelp = require('../helpers/mailHelp');
const lista_precios = require('../helpers/pdf/lista_precios');

function getTitle(req){
	let tipo = req.session.user.tipo;

	if(tipo == 'cliente'){
		return 'Panel de cliente'
	}
	if(tipo == 'admin'){
		return 'Panel de administración'
	}
	if(tipo == 'viajante'){
		return 'Panel de Viajante'
	}
	if(tipo == 'invitado'){
		return 'iniciar sesión'
	}
}

const controller = {
	inicio: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/index", { title_login : title_login });
	},
	login: (req, res) => {
		let error = '';
		if(req.query.error == 'invalidUser'){
			error = 'Debes ingresar a tu cuenta'
		}
		res.render("main/login", { error });
  	},
  	validarLogin: async (req,res) => {

		try {
			let user = await db.usuarios.findOne({ 
				where : { usuario : req.body.usuario },
				logging: false
			})

			if(user){
				if(user.clave == req.body.clave){
					delete user.clave;
					req.session.user = user;
					res.locals.user = user;
					res.cookie('user', user, {maxAge: 1000 * 60 * 60 * 24 * 7});
					return redirect(req,res);

				} else {
					res.render("main/login", { error : 'Usuario o clave inválido' });
				}
			} else {
				res.render("main/login", { error : 'El usuario no existe'});
			}
		}
		catch(err){
			console.error(err)
		}
  	},
	recuperar: async (req, res) => {
		if(req.body.cuit){
			let cuit = req.body.cuit.replace(/-/g,'').trim();
			try {
				let cliente = await db.clientes.findOne({
					where : { cuit },
					attributes : ['numero','correo'],
					logging: false
				})
				let usuario = await db.usuarios.findOne({
					where : { numero : cliente.numero, tipo : 'cliente' },
					attributes : ['usuario','clave'],
					logging: false
				})
				await mailHelp(usuario.usuario, usuario.clave, cliente.correo)
				return res.render('main/recuperar', {mensaje : 'Usuario y clave enviados a su correo: '+ cliente.correo})
			}
			catch(err){
				console.log({
					message : 'Error al recuperar clave',
					err
				})
			}
		} else {
			res.render("main/recuperar", { mensaje: ''});
		}
	},
  	nosotros: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/nosotros", { title_login});
  	},
  	precios: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/precios", { title_login});
	  },
	precios_pdf : (req, res) => {
		// generar PDF lista
		lista_precios(res);
	},
  	destacados: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/destacados", { title_login});
	  },
	destacadosCp: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/destacadosCp", {title_login});
	  },
	
  	cliente: (req, res) => {
		let title_login = getTitle(req);
  	    res.render("main/cliente", {title_login});
  	},
  	contacto: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/contacto", { title_login});
	},
  	logout : (req, res) => {
		req.session.destroy();
		res.locals.user = {};
		delete res.locals;
		delete res.session;
		res.cookie('user', null, { maxAge: -1 });
		return res.redirect('/');
	},
	formulario : (req, res) => {
		let type = req.query.type;

		if(req.body.email){
			return res.redirect('/')
			/* este input es trampa para los bots y esta oculto, si viene con
			texto es porque el formulario lo envio un bot
			*/
		} else {
			return res.send('enviado')
			//mailHelp.contacto(req,res)
		}
		
		if(type == 'cliente'){
			mailHelp.cliente(req,res)
		}
	}
};

module.exports = controller;
