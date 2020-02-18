const db = require("../database/models");
const query = require('../helpers/queryHelper');
const filters = require('../helpers/filtersHelper');
const functions = require('../helpers/catalogoFunctions');

const controller = {

  inicio: (req, res, next) => {
	  
	let articulos = query.general(req);
	let lineas = db.lineas.findAll();
	let rubros = db.rubros.findAll();

    Promise
      .all([ articulos, lineas, rubros ])
      .then(results => {
        res.render("main/catalogo", {
        articulos: results[0],
        lineas: results[1],
        rubros: results[2],
      })
    }) .catch(error => res.send(error))
  },
  linea: (req, res, next) => {
	  
	functions.deleteFilter(req,res);
	
	let articulos = query.linea(req);
	let lineas = db.lineas.findAll();
	let rubros = db.rubros.findAll();
	let filtros = filters.fetchFilters(req);

    Promise
      .all([ articulos, lineas, rubros])
      .then(results => {
        res.render('main/catalogo',{
        articulos: results[0],
        lineas: [''],
        rubros: results[2],
		filtros : filtros
        })
      }) .catch(error => res.send(error))
  },
  rubro: (req, res, next) => {
	  
	functions.deleteFilter(req,res);
	
	let articulos = query.rubro(req);
	let lineas = db.lineas.findAll();
	let rubros = db.rubros.findAll();
	let filtros = filters.fetchFilters(req);

    Promise
      .all([ articulos, lineas, rubros])
      .then(results => {
        res.render('main/catalogo',{
        articulos: results[0],
        lineas: results[1],
        rubros: [''],
		filtros : filtros
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
   
  }
};

module.exports = controller;
