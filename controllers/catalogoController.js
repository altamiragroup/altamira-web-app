const db = require("../database/models");
const checkroutes = require("../helpers/catalogoRoutes");
// en la constante "traer" estan todas las consultas al a db
const traer = require('../helpers/catalogoConsultas')
const controller = {

  inicio: (req, res, next) => {

    Promise
      .all([traer.articulos,traer.lineas,traer.rubros/* ,traer.sub_rubros */])
      .then(results => {
        res.render("main/catalogo", {
        articulos: results[0],
        lineas: results[1],
        rubros: results[2],
      })
    }) .catch(error => res.send(error))
  },
  linea: (req, res, next) => {

    Promise
      .all([traer.articulosLinea(req), traer.lineas, traer.rubros])
      .then(results => {
        res.render('main/catalogo',{
        articulos: results[0],
        lineas: results[1],
        rubros: results[2],
        })
      }) .catch(error => res.send(error))
  },
  rubro: (req, res, next) => {

    Promise
      .all([traer.articulosRubro(req), traer.lineas, traer.rubros])
      .then(results => {
        res.render('main/catalogo',{
        articulos: results[0],
        lineas: results[1],
        rubros: results[2],
        })
      }) .catch(error => res.send(error))
  },
  sub_rubro: (req, res, next) => {

  },
  detalle: (req, res, next) => {

    db.articulos.findOne({ where : { id : req.params.articuloId}})
    .then(articulo => { res.render('main/detalle', { articulo })})
    
  },
  destacados: (req, res, next) => {
    
  },
  nuevos: (req, res, next) => {
   
  },
};

module.exports = controller;
