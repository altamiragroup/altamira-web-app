const db = require("../database/models");
const sequelize = db.sequelize;
const pdf = require("html-pdf");
const compRequest = require('../requests/src/comprobantes');

const controller = {
    perfil : (req, res) => {
        let user = req.session.user;
        let usuarios =  db.usuarios.findOne({ where : { id : user.id} });
        let clientes = db.clientes.findOne({ where : { numero : user.numero} })
        Promise
            .all([usuarios,clientes])
            .then(result => {
                res.render('clientes/perfil', { 
                    usuario: result[0].usuario,
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
                    comprobantes: result[1],
                    usuario: req.session.user.usuario
                    })
            })
    },
    detalle : (req, res) =>  {

        let cliente = req.session.user.numero
        let numero = req.params.numeroComp;

        res.render('clientes/comprobanteDetalle',{
            cliente,
            numero
        });
    },
    pagos : (req, res) => {
        let user = req.session.user;
        let clientes = db.clientes.findOne({ where : { numero : user.numero} });
        let comprobantes = db.comprobantes.findAll({ where : { cliente_num : user.numero } });

        Promise
            .all([clientes,comprobantes])
            .then(result => {
                let facturas = [];
                result[1].forEach(comp => {
                    let tipoFact = comp.tipo.split(' ');
                    if(tipoFact[0] == 'Factura'){
                        facturas.push(comp.numero)
                    }
                })
                res.render('clientes/pagos', { 
                    cliente: result[0],
                    comprobantes: facturas 
                })
            })
    },
    seguimiento : (req, res) => {
        res.render('clientes/seguimientos', {cliente : 'alejandro'})
    },
    pedidos : (req, res) => {
        res.render('clientes/pedidos', {cliente : 'alejandro'})
    },
    pruebas : (req, res) => {

        compRequest.getComp('credito')
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(error => res.send(error))
    }
}

module.exports = controller;