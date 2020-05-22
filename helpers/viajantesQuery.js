const Sequelize = require("sequelize");
const db = require("../database/models");
const Op = Sequelize.Op;

module.exports = {

    clientes : (query) => {
        
        return db.clientes.findAll({ 
			where : { 
            	[Op.and]: [
                	{ viajante_id : user.numero },
                	{ [Op.or] : [
                	    { numero : {[Op.like]: '%' + query + '%' }},
                	    { direccion : {[Op.like]: '%' + query + '%' }},
                	    { razon_social : {[Op.like]: '%' + query + '%' }}
                	]}
				]
			},
			include : [{model: db.usuarios, as: 'usuario', attributes : ['usuario','clave']}],
			limit : 50, logging: false 
		})
    },
    cobranzas : (query) => {
        
        return db.clientes.findAll({
          where: {
            [Op.and]: [
              { viajante_id: user.numero },
              {
                [Op.or]: [
                  { numero: { [Op.like]: "%" + query + "%" } },
                  { direccion: { [Op.like]: "%" + query + "%" } },
                  { razon_social: { [Op.like]: "%" + query + "%" } }
                ]
              }
            ]
          },
          attributes: ["razon_social"],
          include: [
            {
              model: db.saldos,
              as: "saldo",
              attributes: ["saldo"],
              required: true
            },
            {
              model: db.comprobantes,
              as: "comprobantes",
              include: [
                {
                  model: db.seguimientos,
                  as: "seguimiento",
                  attributes: ["salida"],
                  raw: true
                }
              ]
            }
          ],
          order: ["razon_social"],
		  logging: false
        });
    },
	seguimientos : (query) => {
		return db.clientes.findAll({
    		where: {
        		[Op.and]: [
        		  { viajante_id: user.numero },
        		  {
        		    [Op.or]: [
        		      { numero: { [Op.like]: "%" + query + "%" } },
        		      { direccion: { [Op.like]: "%" + query + "%" } },
        		      { razon_social: { [Op.like]: "%" + query + "%" } }
        		    ]
        		  }
        		]
        	},
    		attributes: ["razon_social"],
    		include: [
    		  {
    		    model: db.seguimientos,
    		    as: "seguimientos",
    		    attributes: { exclude: ["cuenta"] },
    		    required: true
    		  }
    		],
    		order: ["razon_social"],
			logging: false
    	});
	}
}