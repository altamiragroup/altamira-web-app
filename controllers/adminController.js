const db = require('../database/models');
const Sequelize = require("sequelize");

module.exports = {
    panel : (req, res) =>{
        let pedidos = db.pedidos.findAll({
            attributes : ['id','cliente_id','fecha'],
            include : [{ model: db.clientes, as: 'cliente', attributes: ['razon_social']}],
            order : [['fecha','DESC']],
            limit : 10
        })
        let articulos = db.pedido_articulo.findAll()
        let pendientes = db.pendientes.findAll()
        let total_aprox = db.pedido_articulo.sum('precio')

        Promise.all([pedidos,articulos,pendientes,total_aprox])
        .then(result => {
            //return res.send(result)
            res.render('admin/panel', {
                pedidos : result[0],
                articulos_pedidos : result[1],
                pendientes : result[2],
                total_vendido : result[3]
            })
        })
        .catch(error => res.send(error))
        //res.render('admin/panel')
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