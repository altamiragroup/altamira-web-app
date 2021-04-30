const db = require('../database/models');
const sequelize = db.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const query = require('../helpers/query');
const catalogo = require('../helpers/catalogo');
const functions = require('../helpers/functions');
const carrito = require('../helpers/carrito');
const filtros = require('../helpers/filtros');
const mail = require('../helpers/mailHelp');

const controller = {
  inicio: async (req, res) => {
    let page = req.query.page != undefined ? req.query.page : 0;
    const cliente = req.session.user.numero;

    try {
      let cart = await carrito.traer(cliente);
      let articulos = req.body.busqueda_simple
        ? await query.simple(req)
        : await query.detallada(req);
      let lineas = await db.lineas.findAll({ logging: false });
      let rubros = await sequelize.query('SELECT DISTINCT nombre FROM rubros ORDER BY nombre', {
        type: sequelize.QueryTypes.SELECT,
        logging: false,
      });
      let especialidades = await sequelize.query(
        'SELECT DISTINCT nombre FROM especialidades ORDER BY nombre',
        {
          type: sequelize.QueryTypes.SELECT,
          logging: false,
        }
      );

      res.setHeader('Surrogate-Control', 'no-store');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.render('catalogo/index', {
        articulos,
        lineas,
        rubros,
        page, //paginacion
        cart, //carrito,
        especialidades,
      });
    } catch (err) {
      console.error({
        message: 'Error en el catálogo',
        err,
      });
    }
  },
  filtro: (req, res) => {
    if (req.query.limpiar) {
      filtros.borrar(req);
      filtros.crear(req);
    }
    // recibir los filtros y agregarlos
    // a la variable Filters en sesion
    filtros.actualizar(req);

    // Deshabilitar cache para los filtros del catalogo
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.redirect('/catalogo/');
  },
  detalle: async (req, res) => {
    const cliente = req.session.user.numero;
    let cart = await carrito.traer(cliente);
    let id = req.params.articuloId;

    try {
      let articulo = await db.articulos.findOne({
        where: { id },
        logging: false,
      });
      let articulo_nombre = articulo.descripcion.replace(/ \w{2} /g, ' ').split(' ')[0];
      let articulo_nombre_ = articulo.descripcion.replace(/ \w{2} /g, ' ').split(' ')[1];
      //console.log(articulo_nombre + ' ' + articulo_nombre_)
      let relacionados = await db.articulos.findAll({
        where: {
          [Op.and]: [
            {
              descripcion: {
                [Op.and]: [
                  { [Op.like]: '%' + articulo_nombre + '%' },
                  { [Op.like]: '%' + articulo_nombre_ + '%' },
                  //{[Op.regexp]: '\s?' + articulo_nombre + ' ?.+'}
                ],
              },
            },
            //{ rubro_id : articulo.rubro_id },
            //{ orden : articulo.orden },
            //{ linea_id : articulo.linea_id },
            //{ renglon : articulo.renglon },
            { codigo: { [Op.ne]: articulo.codigo } },
          ],
        },
        logging: false,
        limit: 4,
      });

      res.render('catalogo/detalle', {
        relacionados,
        articulo,
        cart,
      });
    } catch (err) {
      console.error({
        message: 'Error en detalle de articulo',
        err,
      });
    }
  },
  resumen: async (req, res) => {
    let cliente = req.session.user.numero;

    try {
      let cart = await carrito.traer(cliente);
      let stock = await carrito.traerArticulosPorStock(cliente);
      let pendientes = await db.pendientes.findAll({
        where: { cliente },
        include: [
          {
            model: db.articulos,
            as: 'articulos',
            attributes: ['stock'],
          },
        ],
        logging: false,
      });
      // calcular cuantos pendientes ya tienen stock
      let en_stock = pendientes.articulos
        ? pendientes.filter(art => art.articulos[0].stock >= art.cantidad).length
        : [];
      res.setHeader('Surrogate-Control', 'no-store');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      return res.render('catalogo/resumen', {
        cart,
        stock,
        pendientes: en_stock,
      });
    } catch (err) {
      console.error({
        message: 'Error en resumen de pedido',
        err,
      });
    }
  },
  actualizar: (req, res) => {
    let cliente = req.session.user.numero;
    let accion = req.query.update;
    let articulo = req.query.item;
    let cantidad = req.query.cantidad ? req.query.cantidad : null;
    // actualizar carrito desde resumen
    carrito.actualizarArticulo(cliente, articulo, accion);

    // Disable caching for content files
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.redirect('/catalogo/resume');
  },
  pendientes: async (req, res) => {
    let cliente = req.session.user.numero;

    try {
      let cart = await carrito.traer(cliente);
      let result = await catalogo.traerPendientes(cliente);

      res.render('catalogo/pendientes', {
        pendientes: result[0].articulos,
        cart,
      });
    } catch (err) {
      console.error(err);
    }
  },
  relacionados: async (req, res) => {
    let art = req.query.relative;
    let cliente = req.session.user.numero;

    try {
      let cart = await carrito.traer(cliente);
      let articulo = db.articulos.findOne({
        where: { codigo: art },
        attributes: ['oem'],
        logging: false,
      });
      let relacionados = await db.articulos.findAll({
        where: {
          [Op.and]: [
            { oem: { [Op.like]: '%' + articulo.oem.trim() + '%' } },
            { codigo: { [Op.notLike]: art.trim() } },
          ],
        },
        logging: false,
      });
      res.render('catalogo/relacionados', {
        relacionados,
        cart,
      });
    } catch (err) {
      console.error(err);
    }
  },
  finalizar: async (req, res) => {
    let cliente = req.session.user.numero;

    try {
      let cart = await carrito.traer(cliente);
      let stock = await carrito.traerArticulosPorStock(cliente);

      res.render('catalogo/finalizar', {
        cart,
        stock,
      });
    } catch (err) {
      console.error({
        message: 'error finalizando pedido',
        error: err,
      });
    }
  },
  checkout: async (req, res) => {
    let cliente = req.session.user.numero;
    let fecha = functions.fechaActual();
    let nota = req.body.nota;

    transaction = await sequelize.transaction();

    try {
      let articulos = await carrito.traerArticulosPorStock(cliente);
      let total_items = articulos.positivos.length + articulos.criticos.length;
      let confirmados = [];
      let pendientes = [];

      for (let articulo of articulos.negativos) {
        pendientes.push({
          cliente: cliente,
          articulo: articulo.codigo,
          cantidad: articulo.cantidad,
        });
      }

      let pendi = await db.pendientes.bulkCreate(pendientes, { logging: false, transaction });
      let nuevo = await db.pedidos.create(
        {
          cliente_id: cliente,
          estado: 0,
          fecha,
          nota,
          total_items,
        },
        { logging: false, transaction }
      );

      let pedido = await db.pedidos.findOne({
        where: {
          cliente_id: nuevo.cliente_id,
          fecha: fecha,
        },
        attributes: ['id'],
        logging: false,
        transaction,
      });
      for (let articulo of articulos.positivos) {
        confirmados.push({
          pedido_id: pedido.id,
          articulo_id: articulo.codigo,
          cantidad: articulo.cantidad,
          precio: articulo.precio,
        });
      }

      for (let articulo of articulos.criticos) {
        confirmados.push({
          pedido_id: pedido.id,
          articulo_id: articulo.codigo,
          cantidad: articulo.cantidad,
          precio: articulo.precio,
        });
      }

      await db.pedido_articulo.bulkCreate(confirmados, { logging: false, transaction });

      let datos_cli = await db.clientes.findOne({
        where: { numero: cliente },
        attributes: ['razon_social', 'correo'],
        transaction,
      });

      let carrito_arts = [];
      articulos.positivos.forEach(art => carrito_arts.push(art));
      articulos.criticos.forEach(art => carrito_arts.push(art));

      // eliminar el carrito
      await carrito.eliminar(cliente);
      // guardar transacción
      await transaction.commit();

      await mail.compra(
        datos_cli.razon_social,
        datos_cli.correo,
        cliente,
        fecha,
        nota,
        carrito_arts
      );
      return res.render('catalogo/confirmacion', { mensaje: 'Tu pedido se envió correctamente' });
    } catch (err) {
      await transaction.rollback();

      console.error({
        message: 'Error Checkout pedido',
        error: err,
      });

      return res.render('catalogo/confirmacion', {
        mensaje: 'Ocurrió un problema al enviar tu pedido',
      });
    }
  },
};

module.exports = controller;
