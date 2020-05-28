const Sequelize = require("sequelize");
const db = require("../database/models");
const queries = require('../helpers/viajantesQuery');
const catalogo = require('../helpers/catalogo');

const controller = {
    panel : (req, res) => {
        let user = req.session.user;
        db.viajantes.findOne({ where : {numero : user.numero },logging : false })
        .then(viajante => {
            res.render('viajantes/perfil',{
                viajante
            })
        })
    },
    clientes : (req, res) => {
        let user = req.session.user;
        if(req.body.busqueda){      
            let query = req.body.busqueda;
            queries.clientes(query) // la consulta se hace en un helper
            .then(clientes => {
                res.render('viajantes/clientes',{
                    clientes
                })
            })
        } else {
            db.clientes.findAll({ 
				where : { 
					viajante_id : user.numero 
				}, 
				limit : 50, 
				logging : false ,
				include : [{model: db.usuarios, as: 'usuario', attributes : ['usuario','clave']}]
			})
            .then(clientes => {
                res.render('viajantes/clientes',{
                    clientes
                })
            })
        }

    },
    cobranzas : (req, res) => {
        let user = req.session.user;

		if(req.body.busqueda){
			let query = req.body.busqueda;

        	queries.cobranzas(query) // la consulta se hace en un helper
        	.then(clientes => {
        	  res.render("viajantes/cobranzas", {
        	    clientes
        	  });
        	})
        	.catch(error => res.send(error));		
        	
		} else {
			db.clientes.findAll({
        	    where: { viajante_id: user.numero },
        	    attributes: ["cod_postal","razon_social","precio_especial"],
        	    include: [
        	      { model: db.saldos, as: "saldo", attributes: ['saldo'], required: true},
        	      {
        	        model: db.comprobantes,
					as: "comprobantes",
        	        include: [
        	          {
        	            model: db.seguimientos,
        	            as: "seguimiento",
        	            attributes: ["salida", "transporte"],
        	            raw : true
        	          }
        	        ]
        	      }
        	    ],
        	    order : ['cod_postal','razon_social', [ db.comprobantes, 'fecha', 'ASC']],
				logging : false
        	  })
        	  .then(clientes => {
        	    res.render("viajantes/cobranzas", {
        	      clientes
        	    });
        	  })
        	  .catch(error => res.send(error));
		}
    },
	pdf : (req, res) => {
		res.render('viajantes/cobranzasPDF')
	},
    seguimiento : (req, res) => {
        let user = req.session.user;

		if(req.body.busqueda){
			let query = req.body.busqueda;

			queries.seguimientos(query)
			.then(seguimientos => {
        		res.render('viajantes/seguimientos',{
					seguimientos
				})
			})		
		}
		db.clientes.findAll({
            where: { viajante_id: user.numero },
            attributes: ["razon_social"],
            include: [
              {
                model: db.seguimientos,
                as: "seguimientos",
                attributes: { exclude : ['cuenta']},
                required: true
              }
            ],
            order: ["razon_social"],
			logging : false
        })
		.then(seguimientos => {
			//return res.send(seguimientos)
        	res.render('viajantes/seguimientos',{
				seguimientos
			})
		})
    }
}

module.exports = controller;