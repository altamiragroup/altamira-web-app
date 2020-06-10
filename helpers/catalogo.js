const db = require('../database/models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const carrito = require('./carrito');

module.exports = {
    fechaActual : () => {
        let fecha = new Date()

        let yyyy = fecha.getFullYear();
        let mm = fecha.getMonth() + 1;
        let dd = fecha.getDate();
        
        let hh = fecha.getHours();
        let mmm = fecha.getMinutes();
        let sss = fecha.getSeconds();

        let fechaAct = `${yyyy}-${mm}-${dd} ${hh}:${mmm}:${sss}`
        return fechaAct
    },
    descuentoCliente : (req) => {

        db.clientes.findOne({
            where : { numero : req.session.user.numero },
            attributes : ['condicion_pago'],
            logging: false
        })
        .then(cliente => {
            let desc = cliente.condicion_pago;
            if(desc == 'A') return 25
            if(desc == 'B') return 20
            if(desc == 'C') return 30
        })
        .catch(error => {
            console.log(error)
            return 25
        })
    },
    traerPendientes : (req) => {
        let cliente = req.session.user.numero

        return db.clientes.findAll({
            where : { numero : cliente },
            attributes : ['numero'],
            include : ['articulos'],
            logging: false
        })
    },
    actualizarPendientes : (art,cant,action,res) => {
        db.pendientes.destroy({
            where : {
                articulo : art
            },
            logging: false
        }).then(result => {
            if(action == 'agregar'){
                carrito.agregarProducto(req, res, art);
                return res.redirect('/catalogo/pendientes')
            }
        })
    }
}