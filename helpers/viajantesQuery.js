const Sequelize = require("Sequelize");
const db = require("../database/models");
const sequelize = db.sequelize;
const Op = Sequelize.Op;

module.exports = {

    clientes : (query) => {
        
        return db.clientes.findAll({ where : { 
            [Op.and]: [
                { viajante_id : user.numero },
                { [Op.or] : [
                    { numero : {[Op.like]: '%' + query + '%' }},
                    { direccion : {[Op.like]: '%' + query + '%' }},
                    { razon_social : {[Op.like]: '%' + query + '%' }}
                ]}],         
        }, limit : 50 })
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
          order: ["razon_social"]
        });
    }
}