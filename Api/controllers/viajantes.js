const Sequelize = require("sequelize");
const db = require("../../database/models");
const catalogo = require('../../helpers/catalogo');

module.exports = {
    listadoPDF : (req, res) => {
        let user = req.session.user;
		db.clientes.findAll({
        	where: { viajante_id: user.numero },
        	attributes: ["razon_social","direccion","telefono"],
        	include: [
        	    { model: db.saldos, as: "saldo", attributes: ['saldo'], required: true},
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
        .then(data => {
        	db.viajantes.findOne({
				where : { numero : req.session.user.numero }
			})
			.then( viajante => {
				let fecha = catalogo.fechaActual();
				// formatear fechas de comprobante y salida
				for(comp of data){
					comp.comprobantes.map( item => {
						item.fecha = item.formatDate();
						if(item.seguimiento != null){
							item.seguimiento.salida =  item.seguimiento.formatDate(item.seguimiento.salida)
						}
					})
				}
                return res.send({viajante, fecha, data})
			})
			.catch(error => res.send(error))
        })
        .catch(error => res.send(error));
    }
}