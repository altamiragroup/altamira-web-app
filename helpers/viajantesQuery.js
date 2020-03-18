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
        } })
    }
}