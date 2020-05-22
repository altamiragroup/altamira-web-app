const db = require("../database/models");
const sequelize = db.sequelize;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const query = require('../helpers/query');
const catalogo = require('../helpers/catalogo');
const carrito = require('../helpers/carrito');
const filtros = require('../helpers/filtros');

const controller = {
  	inicio: async (req, res) => {
		let page = req.query.page != undefined ? req.query.page : 0;
		let cart = await carrito.traerCarrito(req)
		let filtrosAplicados = await filtros.traerFiltros(req, res);
		let articulos = req.body.busqueda_simple ? await query.simple(req) : await query.detallada(req);
		let lineas = db.lineas.findAll({ logging: false });
		//let rubros = db.rubros.findAll({ logging: false });
		let rubros = sequelize.query('SELECT DISTINCT nombre FROM rubros ORDER BY nombre', { type: sequelize.QueryTypes.SELECT, logging : false});

    	Promise.all([ articulos, lineas, rubros ])
    	.then(results => {
    		res.render("main/catalogo/catalogo", {
    			articulos: results[0],
    			lineas: results[1],
    			rubros: results[2],
    			page, //paginacion
    			cart, //carrito
				filtros : filtrosAplicados //filtros de busqueda
    		})
    	}).catch(error => res.send(error))
  	},
	filtro : (req, res) => {
		// recibir los filtros y agregarlos
		// a la variable Filters en sesion
		filtros.manejarFiltros(req);
		res.redirect('/catalogo/')
	},
  	detalle: async (req, res, next) => {
		let cart = await carrito.traerCarrito(req)

    	db.articulos.findOne({ where : { id : req.params.articuloId}, logging: false})
    	.then(articulo => {
			db.articulos.findAll({ where : {
				[Op.and] : [
					{ orden : articulo.orden },
					{ linea_id : articulo.linea_id },
					{ renglon : articulo.renglon }
				]
			},logging: false, limit : 4 })
			.then(relacionados => {
      			res.render('main/catalogo/detalle', {
			  	relacionados, 
      		  	articulo,
      		  	cart 
      		  	})
			})
			.catch(error => console.log(error))
      	})
  	},
  	resumen: async (req, res, next) => {

		let cart = await carrito.traerCarrito(req)
		let stock = await carrito.validarStock(req)

		catalogo.traerPendientes(req)
		.then(result => {
			res.render('main/catalogo/resumen',{
				cart,
				stock,
				pendientes : result[0].articulos
			})
		})
		.catch(error => console.log(error))
  	},
	actualizar : (req, res) => {
		// actualizar carrito desde resumen
		carrito.actualizarProducto(req)
		return res.redirect('/catalogo/resume')
	},
  	pendientes: async (req, res) => {
    	let cart = await carrito.traerCarrito(req);

		catalogo.traerPendientes(req)
		.then(result => {
			res.render('main/catalogo/pendientes',{
				pendientes : result[0].articulos,
				cart
    		})
		})
		.catch(error => console.log(error))
  	},
  	relacionados : async (req, res) => {
    	let cart = await carrito.traerCarrito(req)
    	let art = req.query.relative

    	db.articulos.findOne({ where: { codigo : art }, attributes : ['oem'], logging: false})
    	.then(articulo => {
    	    db.articulos.findAll({
    	        where : {
					[Op.and] : [
						{oem: {[Op.like]: '%'+ articulo.oem.trim() +'%' }},
						{codigo: {[Op.notLike]: art.trim() }}
					]
    	        }, logging: false
    	    })
    	    .then(relacionados => {
		    	res.render('main/catalogo/relacionados',{
		    		relacionados,
		    		cart
		    	})
		    })
    	})
	},
  	finalizar: async (req, res) => {
    	let cart = await carrito.traerCarrito(req)
    	let stock = await carrito.validarStock(req);

		res.render('main/catalogo/finalizar',{
			cart,
			stock
		});
  	},
  	checkout: async (req, res) => {

		let articulos = await carrito.validarStock(req);
		let confirmados = [];
		let pendientes = [];
		let fecha = catalogo.fechaActual();
		let nota = req.body.nota;

		for (let articulo of articulos.negativos) {
			pendientes.push({ 
				cliente : req.session.user.numero,  
				articulo: articulo.codigo, 
				cantidad: articulo.cantidad 
			})
		}
		db.pendientes.bulkCreate(pendientes)
		.then(result => {
			db.pedidos.create({
				cliente_id : req.session.user.numero,
				estado : 0,
				fecha,
				nota
			})
			.then(result => {
				db.pedidos.findOne({
					where : {
						cliente_id : result.cliente_id,
						fecha : result.fecha
					}, 
					attributes : ['id']
				})
				.then(pedido => {
					for (let articulo of articulos.positivos) {
						confirmados.push({ 	
							pedido_id: pedido.id,
							articulo_id : articulo.codigo,  
							cantidad: articulo.cantidad,
							precio: articulo.precio
						})
					}
					for (let articulo of articulos.criticos) {
						confirmados.push({ 	
							pedido_id: pedido.id,
							articulo_id : articulo.codigo,  
							cantidad: articulo.cantidad,
							precio: articulo.precio
						})
					}
					db.pedido_articulo.bulkCreate(confirmados)
					.then( result => {
						// eliminar el carrito
						carrito.eliminarCarrito(req);
						return res.redirect('/clientes/pedidos');
					})
					.catch(error => console.log(error))
				})
			})
		})
		.catch(error => { console.log(error) })
  	}
};

module.exports = controller;
