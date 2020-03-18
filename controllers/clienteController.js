const db = require("../database/models");
const sequelize = db.sequelize;
const compRequest = require('../requests/src/comprobantes');

const controller = {
    perfil : (req, res) => {
        let user = req.session.user;
        let usuarios =  db.usuarios.findOne({ where : { id : user.id} });
        let clientes = db.clientes.findOne({ 
            where : { numero : user.numero},
            include : [{ model: db.viajantes , as : 'viajante' , attributes : ['numero','nombre','telefono','email']}] })
        let saldo = db.saldos.findOne({where : { cuenta : user.numero }})
        Promise
            .all([usuarios, clientes, saldo])
            .then(result => {
                res.render('clientes/perfil', { 
                    usuario: result[0].usuario,
                    cliente: result[1],
                    saldo : result[2]
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

    },
    pedidos : (req, res) => {
        let user = req.session.user;

        let pedidos = db.seguimientos.findAll({ where : { cuenta : user.numero} })
        let pedidosWeb = db.pedidos.findAll({ 
            where : { cliente_id : user.numero}, 
            include : [ {model: db.articulos, as: 'articulos', attributes : ['codigo']} ] })
        Promise
            .all([pedidos, pedidosWeb])
            .then(result => {
                res.render('clientes/pedidos', {
                    seguimientos : result[0],
                    pedidos : result[1]
                })
            })
            .catch( error => console.log(error))
    },
    pruebas : (req, res) => {

        compRequest.getComp('credito')
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(error => res.send(error))
    }
}

module.exports = controller;