const sql = require("mssql");
const db = require("../../database/models");
const Sequelize = require("sequelize")
const queryPDF = require('../helpers/queryPDF')
const sequelize = db.sequelize;
const Op = Sequelize.Op;

// DB MSSQL info
const config = {
    	user: "sa",
    	password: "B0mbard3o!",
    	server: "190.57.226.9",
    	database: "DotAltamira"
    };

module.exports = {
	comprobantes : (req, res) => {
		db.comprobantes.findAll()
		.then( response => {
			res.json({
				status_code : res.statusCode,
                collection : 'comprobantes',
                total_items : response.length,
                response
			})
		})
	},
	detalle : (req, res) => {

		if(req.query.PDF){
			//Exportar la data completa del comprobante para PDF
			queryPDF(req,res)
			return
		}

		db.comprobantes.findByPk(req.params.id)
		.then( response => {
			res.json({
				status_code : res.statusCode,
				collection : 'comprobantes',
				resource : req.params.id,
                total_items : response.length,
                response
			})
		})
	},
    cliente : (req, res) => {
		// enviar todos los comprobantes
		let cuenta = req.params.cliente;
		let tipo = req.query.tipo ? {tipo : {[Op.like]: `%${req.query.tipo}%`}} : '';

        db.comprobantes.findAll({ 
			where : { 
				cliente_num : cuenta,
				...tipo
			},
			order : [ ['fecha','DESC']]
		})
		.then(response => {
			res.json({
				status_code : res.statusCode,
				collection : 'comprobantes',
				client : cuenta,
                total_items : response.length,
                response
			})
        })
	},
	tipo : (req, res) => {
		let tipo = req.params.tipo; 

		db.comprobantes.findAll({
			where : {
				tipo : {[Op.like]: `%${tipo}%`}
			}
		})
		.then( response => {
			res.json({
				status_code : res.statusCode,
				collection : 'comprobantes',
				type : tipo,
                total_items : response.length,
                response	
			})
		})
	}
}