const db = require("../database/models");

const controller = {
    perfil : (req, res) => {
        db.usuarios.findOne({ where : { id : req.session.user_id} })
            .then(usuario => {
                db.clientes.findOne({ where : { numero : usuario.numero} })
                    .then(cliente => {
                        console.log('-----------------');
                        console.log(cliente);
                        console.log('-----------------');
                        res.render('clientes/perfil', { 
                            usuario: usuario,
                            cliente: cliente 
                            })
                    })
            });
    }
}

module.exports = controller;