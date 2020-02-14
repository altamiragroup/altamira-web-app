const db = require("../database/models");

const controller = {
    perfil : (req, res) => {
        let user = req.session.user;
        let usuarios =  db.usuarios.findOne({ where : { id : user.id} });
        let clientes = db.clientes.findOne({ where : { numero : user.numero} })

        Promise
            .all([usuarios,clientes])
            .then(result => {
                res.render('clientes/perfil', { 
                    usuario: result[0],
                    cliente: result[1] 
                    })
            })
    },
    comprobantes : (req, res) => {
        let user = req.session.user;
        let clientes = db.clientes.findOne({ where : { numero : user.numero} });
        let comprobantes = db.comprobantes.findAll({ where : { cliente_num : user.numero } });

        Promise
            .all([clientes,comprobantes])
            .then(result => {
                res.render('clientes/comprobantes', { 
                    cliente: result[0],
                    comprobantes: result[1]  
                    })
            })
    },
    factura : (req, res) =>  {
        res.send('hola')
    }
}

module.exports = controller;