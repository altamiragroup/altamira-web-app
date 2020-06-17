const Sequelize = require("sequelize");
const db = require("../database/models");
const queries = require('../helpers/viajantesQuery');
const catalogo = require('../helpers/catalogo');

const controller = {
    panel : async (req, res) => {
        let user = req.session.user;
        
		try {
			let viajante = await db.viajantes.findOne({ 
				where : {numero : user.numero },
				logging : false 
			})

            return res.render('viajantes/perfil',{
                viajante
        	})
		}
		catch(err){
			console.error(err)
		}
    },
    clientes : async (req, res) => {
		let user = req.session.user;
		let query = req.body.busqueda;

		try {
			let clientes = query ?
				await queries.clientes(req, query)
				:
				await db.clientes.findAll({ 
					where : { 
						viajante_id : user.numero 
					}, 
					limit : 50, 
					logging : false ,
					include : [{
						model: db.usuarios, 
						as: 'usuario', 
						attributes : ['usuario','clave']
					}]
				})
			return res.render('viajantes/clientes',{ clientes })
		}
		catch(err){
			console.error({
				message : 'error Clientes',
				error : err
			})
		}
    },
    cobranzas : async (req, res) => {
        let user = req.session.user;
		let query = req.body.busqueda;

		try {
			let clientes = query ?
				await queries.cobranzas(req, query)
				:
				await db.clientes.findAll({
        	  		where: { viajante_id: user.numero },
        	  		attributes: ["cod_postal","razon_social","precio_especial"],
        	  		include: [
        	  	    	{ 
							model: db.saldos, 
							as: "saldo", 
							attributes: ['saldo'], 
							required: true
						},
        	  	    	{
        	  	      		model: db.comprobantes,
							as: "comprobantes",
        	  	      		include: [{
        	  	      		  	model: db.seguimientos,
        	  	      		  	as: "seguimiento",
        	  	      		  	attributes: ["salida", "transporte"],
        	  	      		  	raw : true
        	  	      		}]
        	  	    	}
        	  	  	],
        	  	  	order : ['cod_postal','razon_social', [ db.comprobantes, 'fecha', 'ASC']],
					logging : false
        	  	})

			return res.render("viajantes/cobranzas", { clientes });
		}
		catch(err){
			console.error({
				message : 'error Cobranzas',
				error : err
			})
		}
    },
	pdf : (req, res) => {
		return res.render('viajantes/cobranzasPDF')
	},
    seguimiento : async (req, res) => {
        let user = req.session.user;
		let query = req.body.busqueda;

		try {
			let seguimientos = req.body.busqueda ?
				await queries.seguimientos(req, query)
				:
				await db.clientes.findAll({
					where : { viajante_id : user.numero },
					attributes : ['razon_social'],
					include : [
						{
							model: db.seguimientos,
							as: 'seguimientos',
							attributes: { exclude: ['cuenta']},
							required: true
						}
					],
					order: ['razon_social'],
					logging: false
				})
			return res.render('viajantes/seguimientos',{ seguimientos })
		}
		catch(err){
			console.error({
				message: 'Error en seguimiento',
				error: err
			})
		}
    }
}

module.exports = controller;