const db = require("../database/models");
const query = require('../helpers/queryHelper');
const filters = require('../helpers/filtersHelper');
const functions = require('../helpers/catalogoFunctions');
const carrito = require('../helpers/carritoFunctions');

const controller = {

  inicio: (req, res) => {
	let page = req.query.page != undefined ? req.query.page : 0;
  let cart = req.session.cart != undefined ? req.session.cart : 0;
  let user = req.session.user != undefined ? req.session.user : 'invitado';

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
        user,
        page,
        cart
      })
    }) .catch(error => res.send(error))
  },
  linea: (req, res, next) => {
	let page = req.query.page != undefined ? req.query.page : 0;
  let cart = req.session.cart != undefined ? req.session.cart : 0;
  let user = req.session.user != undefined ? req.session.user : 'invitado';

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
        user,
        page,
        cart
        })
      }) .catch(error => res.send(error))
  },
  rubro: (req, res, next) => {
	let page = req.query.page != undefined ? req.query.page : 0;
  let cart = req.session.cart != undefined ? req.session.cart : 0;
  let user = req.session.user != undefined ? req.session.user : 'invitado';
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
        user,
        page,
        cart
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
    let cart = req.session.cart != undefined ? req.session.cart : 0;

    db.articulos.findOne({ where : { id : req.params.articuloId}})
    .then(articulo => { 
      res.render('main/catalogo/detalle', { 
        articulo,
        cart 
        }
      )})
    
  },
  resumen: (req, res, next) => {
    let cart = req.session.cart;
    let stock = carrito.checkStock(cart);
    // calcular valores de la compra
    cart.values.totalArticulos = cart.articulos.length;
    cart.values.enStock = carrito.checkStock(cart);
    cart.values.total = carrito.totalCount(cart);
    
    functions.traerPendientes(req)
	  	.then(pendientes => {

			let pendientesTotal = 0;

			for(let articulo of pendientes[0].articulos){
				
			  if(articulo.stock == 1){
				  pendientesTotal += 1
			  }
			}
			console.log(pendientesTotal);
			
    		res.render('main/catalogo/resumen',{
    		  cart,
    		  stock,
			  pendientes : pendientesTotal
    		});	
		})
  },
  pendientes: (req, res, next) => {
    let cart = req.session.cart;
    let stock = carrito.checkStock(cart);

	functions.traerPendientes(req)
	.then(pendientes => {

		//return res.send(pendientes[0].articulos);
    	res.render('main/catalogo/pendientes',{
			cart,
			stock,
			pendientes : pendientes[0].articulos
    	})
	})

  },
  finalizar: (req, res, next) => {
    let cart = req.session.cart;
    cart.values.iva = carrito.calcIva(cart.total);
    let stock = carrito.checkStock(cart);

    res.render('main/catalogo/finalizar',{
		cart,
		stock
    });
  },
  checkout: (req, res, next) => {

    let cart = req.session.cart;
	let articulos = carrito.checkStock(cart);

	let confirmados = [];
	let pendientes = [];
	let fecha = functions.fechaActual();
	
	for (let articulo of articulos.sinStock) {
		pendientes.push(
			{ 
				cliente : req.session.user.numero,  
				articulo: articulo.codigo, 
				cantidad: articulo.cantidad 
			}
		)
	}
	db.pendientes.bulkCreate(pendientes)
		.then(result => {
			db.pedidos.create({
				cliente_id : req.session.user.numero,
				estado : 0,
			 	fecha : fecha
			})
			.then(result => {
				db.pedidos.findOne({
					where : {
						cliente_id : result.cliente_id,
						fecha : result.fecha
					}, attributes : ['id']
				})
				.then(pedido => {

					for (let articulo of articulos.enStock) {
						confirmados.push(
							{ 	
								pedido_id: pedido.id,
								articulo_id : articulo.codigo,  
								cantidad: articulo.cantidad,
								precio: articulo.precio
							}
						)
					}
					db.pedido_articulo.bulkCreate(confirmados)
						.then( result => {
							delete req.session.cart
							return res.send('pedido enviado correctamente')
							return res.redirect('/catalogo');
						})
						.catch(error => res.send(error))
				})
			})
		})
		.catch(error => {
			res.send(error)
		})


  }
};

module.exports = controller;
