const db = require("../database/models");
const pdf = require("html-pdf");

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
    detalle : (req, res) =>  {

        let tipo = req.params.tipoComp;
        let numero = req.params.numeroComp;
        
        res.render('clientes/comprobante')

        
        db.comprobantes.findOne({ where : { numero : numero },
            include : ['articulos'] }) 
            .then(resultado => {
                res.send(resultado)
            }) .catch(error => res.send(error))
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
    }
}

module.exports = controller;