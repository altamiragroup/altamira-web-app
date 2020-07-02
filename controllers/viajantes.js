const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const queries = require('../helpers/viajantesQuery');
const cobranzas_PDF = require('../helpers/pdf/listado_cobranzas');

const controller = {
    panel : async (req, res) => {
        let user = req.session.user;
        
		try {
			let viajante = await db.viajantes.findOne({ 
				where : {numero : user.numero },
				logging : false 
			})
			let comprobantes = await db.comprobantes.findAll({
				where: {
					[Op.and]: [{
						fecha: {
							[Op.lt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
						},
						tipo: {
							[Op.like]: '%Factura%'
						}
					}]
				},
				include: [{
					model: db.clientes,
					as: 'cliente',
					attributes: ['razon_social'],
					where : {
						viajante_id : user.numero
					}
				}],
				attributes: ['numero', 'fecha', 'valor'],
				order : [['fecha','DESC']],
				logging: false
			})
            return res.render('viajantes/perfil',{
				viajante,
				comprobantes
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
		let numero_viajante = req.session.user.numero
		cobranzas_PDF(numero_viajante, res)
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