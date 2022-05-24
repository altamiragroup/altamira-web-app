const db = require('../database/models');
const mailHelp = require('../helpers/mailHelp');
const comprobantes = require('../helpers/pdf/comprobantes');

const controller = {
  perfil: async (req, res) => {
    let user = req.session.user;

    try {
      let usuario = await db.usuarios.findOne({
        where: { id: user.id  },
        attributes: ['usuario','tipo'],
        logging: false,
      });
      let cliente = await db.clientes.findOne({
        where: { numero: user.numero  },
        include: [
          {
            model: db.viajantes,
            as: 'viajante',
            attributes: ['numero', 'nombre', 'telefono', 'email'],
          },
        ],
        logging: false,
      });
      let saldo = await db.saldos.findOne({
        where: { cuenta: user.numero ,tipo: 'cliente'},
        logging: false,
      });

      return res.render('clientes/perfil', {
        usuario: usuario.usuario,
        cliente,
        saldo,
      });
    } catch (err) {
      console.error(err);
    }
  },
  comprobantes: async (req, res) => {
    let user = req.session.user;

    try {
      let cliente = await db.clientes.findOne({
        where: { numero: user.numero,tipo: 'cliente' },
        logging: false,
      });
      let comprobantes = await db.comprobantes.findAll({
        where: { cliente_num: user.numero,tipo: 'cliente' },
        logging: false,
      });
      return res.render('clientes/comprobantes', {
        cliente,
        comprobantes,
        usuario: user.usuario,
      });
    } catch (err) {
      console.error(err);
    }
  },
  detalle: (req, res) => {
    let cliente = req.session.user.numero;
    let numero = req.params.numero;
    let tipo = req.query.tipo;

    comprobantes.comprobante(cliente, numero, tipo, res);
  },
  credito: async (req, res) => {
    try {
      let creditos = await db.ncdescuento.findAll({
        where: {
          cliente: req.session.user.numero,
        },
        attributes: ['numero', 'fecha'],
        group: ['numero', 'fecha'],
        order: [['fecha', 'DESC']],
      });
      return res.render('clientes/credito', {
        creditos,
      });
    } catch (error) {
      console.log(error);
    }
  },
  detalle_credito: (req, res) => {
    let numero = req.params.numero;
    let cliente = req.session.user.numero;
    comprobantes.nota_credito_descuento(cliente, numero, res);
  },
  pagos: async (req, res) => {
    let user = req.session.user;

    try {
      let cliente = await db.clientes.findOne({
        where: { numero: user.numero },
        logging: false,
      });
      let comprobantes = await db.comprobantes.findAll({
        where: { cliente_num: user.numero },
        logging: false,
      });

      let facturas = [];
      comprobantes.forEach(comp => {
        let tipoFact = comp.tipo.split(' ');
        if (tipoFact[0] == 'Factura') {
          facturas.push(comp.numero);
        }
      });

      return res.render('clientes/pagos', {
        cliente,
        comprobantes: facturas,
      });
    } catch (err) {
      console.error(err);
    }
  },
  send: (req, res) => {
    mailHelp.pagos(req, res);
  },
  pedidos: async (req, res) => {
    let user = req.session.user;

    try {
      let seguimientos = await db.seguimientos.findAll({
        where: { cuenta: user.numero },
        logging: false,
      });
      let pedidos = await db.pedidos.findAll({
        where: { cliente_id: user.numero },
        order: [['id', 'DESC']],
        logging: false,
      });

      return res.render('clientes/pedidos', {
        pedidos,
        seguimientos,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = controller;
