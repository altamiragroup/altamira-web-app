const Sequelize = require("Sequelize");
const db = require("../database/models");
const sequelize = db.sequelize;
const Op = Sequelize.Op;

const queries = require('../helpers/viajantesQuery');

const controller = {
    panel : (req, res) => {
        let user = req.session.user;
        //return res.send(res.locals)
        db.viajantes.findOne({ where : {numero : user.numero } })
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
            db.clientes.findAll({ where : { viajante_id : user.numero }, limit : 50 })
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
        	    attributes: ["razon_social"],
        	    include: [
        	      { model: db.saldos, as: "saldo", attributes: ['saldo'], required: true},
        	      {
        	        model: db.comprobantes,
        	        as: "comprobantes",
        	        include: [
        	          {
        	            model: db.seguimientos,
        	            as: "seguimiento",
        	            attributes: ["salida"],
        	            raw : true
        	          }
        	        ]
        	      }
        	    ],
        	    order : ['razon_social']
        	  })
        	  .then(clientes => {
        	    //return res.send(clientes)
        	    res.render("viajantes/cobranzas", {
        	      clientes
        	    });
        	  })
        	  .catch(error => res.send(error));
		}
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
            order: ["razon_social"]
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