let db = require('../database/models');

module.exports = {
    panel : (req, res) =>{
        res.render('admin/panel')
    },
    clientes : (req, res) => {
        res.render('admin/clientes')
    },
    seguimiento : (req, res) => {
        res.render('admin/seguimiento')
    },
    registro : (req, res) => {
        const { usuario, clave, tipo, numero } = req.body;

        db.usuarios.create({
            id: 0,
            usuario,
            clave,
            tipo,
            numero
        })
        .then( result => {
            return res.send('usuario creado exitosamente')
        })
        .catch( error => res.send(error))
    }
}