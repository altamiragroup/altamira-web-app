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
            db.clientes.findAll({ where : { viajante_id : user.numero } })
            .then(clientes => {
                res.render('viajantes/clientes',{
                    clientes
                })
            })
        }

    },
    cobranzas : (req, res) => {

        res.render('viajantes/cobranzas')
    },
    seguimiento : (req, res) => {

        res.render('viajantes/pedidos')
    }
}

module.exports = controller;