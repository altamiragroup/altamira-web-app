const db = require("../database/models");
const query = require('../helpers/queryHelper');
const filters = require('../helpers/filtersHelper');
const functions = require('../helpers/catalogoFunctions');

const controller = {

  inicio: (req, res, next) => {
	let page = req.query.page != undefined ? req.query.page : 0;

	let articulos = query.general(req);
	let lineas = db.lineas.findAll();
	let rubros = db.rubros.findAll();
	let busqueda = filters.fetchSearch(req,res);

    Promise
      .all([ articulos, lineas, rubros ])
      .then(results => {
        res.render("main/catalogo/catalogo", {
        articulos: results[0],
        lineas: results[1],
        rubros: results[2],
        busqueda : busqueda,
        page
      })
    }) .catch(error => res.send(error))
  },
  linea: (req, res, next) => {
	let page = req.query.page != undefined ? req.query.page : 0;

	functions.deleteFilter(req,res);
	
	let articulos = query.linea(req);
	let lineas = db.lineas.findAll();
	let rubros = db.rubros.findAll();
	let filtros = filters.fetchFilters(req);
	let busqueda = filters.fetchSearch(req,res);

    Promise
      .all([ articulos, lineas, rubros])
      .then(results => {
        res.render('main/catalogo/catalogo',{
        articulos: results[0],
        lineas: [''],
        rubros: results[2],
		    filtros : filtros,
        busqueda : busqueda,
        page
        })
      }) .catch(error => res.send(error))
  },
  rubro: (req, res, next) => {
	let page = req.query.page != undefined ? req.query.page : 0;
	functions.deleteFilter(req,res);
	
	let articulos = query.rubro(req);
	let lineas = db.lineas.findAll();
	let rubros = db.rubros.findAll();
	let filtros = filters.fetchFilters(req);
	let busqueda = filters.fetchSearch(req,res);

    Promise
      .all([ articulos, lineas, rubros])
      .then(results => {
        res.render('main/catalogo/catalogo',{
        articulos: results[0],
        lineas: results[1],
        rubros: [''],
		    filtros : filtros,
        busqueda : busqueda,
        page
        })
      }) .catch(error => res.send(error))
  },
  sub_rubro: (req, res, next) => {

  },
  destacados: (req, res, next) => {
    
  },
  nuevos: (req, res, next) => {
   
  },
  detalle: (req, res, next) => {

    db.articulos.findOne({ where : { id : req.params.articuloId}})
    .then(articulo => { res.render('main/catalogo/detalle', { articulo })})
    
  },
  resumen: (req, res, next) => {

    res.render('main/catalogo/resumen');
  },
  finalizar: (req, res, next) => {

    res.render('main/catalogo/finalizar');
  }
};

module.exports = controller;
