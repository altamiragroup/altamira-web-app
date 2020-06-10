const db = require("../database/models");
const sequelize = db.sequelize;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const query = require('../helpers/query');
const catalogo = require('../helpers/catalogo');
const carrito = require('../helpers/carrito');
const filtros = require('../helpers/filtros');
const mail = require('../helpers/mailHelp');

const controller = {
  	inicio: async (req, res) => {
		let page = req.query.page != undefined ? req.query.page : 0;
		
		try {
			let cart = await carrito.traerCarrito(req)
			let articulos = req.body.busqueda_simple ? 
				await query.simple(req) 
				: 
				await query.detallada(req);
			let lineas = await db.lineas.findAll({ logging: false });
			let rubros = await sequelize.query('SELECT DISTINCT nombre FROM rubros ORDER BY nombre', { 
				type: sequelize.QueryTypes.SELECT, 
				logging : false
			});

			res.setHeader('Surrogate-Control', 'no-store')
        	res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        	res.setHeader('Pragma', 'no-cache')
        	res.setHeader('Expires', '0')
			res.render("main/catalogo/catalogo", {
    			articulos,
    			lineas,
    			rubros,
    			page, //paginacion
    			cart, //carrito
    		})
		}
		catch(err){
		  	console.error({
				message : 'Error en el catálogo',
				err
		  	})
		}
  	},
	filtro : (req, res) => {
		if(req.query.limpiar){
			filtros.borrarFiltros(req);
			return res.redirect('/catalogo/')
		}
		// recibir los filtros y agregarlos
		// a la variable Filters en sesion
		filtros.manejarFiltros(req);

		// Disable caching for content files
		res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

		return res.redirect('/catalogo/')
	},
  	detalle: async (req, res, next) => {
		let cart = await carrito.traerCarrito(req)
		let id = req.params.articuloId;

		try {
			let articulo = await db.articulos.findOne({ 
				where : { id }, 
				logging: false
			});
			let relacionados = await db.articulos.findAll({ 
				where : {
					[Op.and] : [
						{ orden : articulo.orden },
						{ linea_id : articulo.linea_id },
						{ rubro_id : articulo.rubro_id },
						{ renglon : articulo.renglon }
					]
				},
				logging: false,
				limit : 4 
			});

			res.render('main/catalogo/detalle', {
			  	relacionados, 
      		  	articulo,
      		  	cart 
      		})
		}
		catch(err){
			console.error({
				message : 'Error en detalle de articulo',
				err
			})
		}
    	
  	},
  	resumen: async (req, res, next) => {
		let cliente = req.session.user.numero;

		try {
			let cart = await carrito.traerCarrito(req)
			let stock = await carrito.validarStock(req)

			let pendientes = await db.pendientes.findAll({
        	    where : { cliente },
        	    include : [{
					model : db.articulos,
					as : 'articulos',
					attributes : ['stock']
				}],
        	    logging: false
        	})
			// calcular cuantos pendientes ya tienen stock
			let en_stock = pendientes.filter(art => art.articulos[0].stock > art.cantidad).length;

			res.setHeader('Surrogate-Control', 'no-store');
        	res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        	res.setHeader('Pragma', 'no-cache');
        	res.setHeader('Expires', '0');

			return res.render('main/catalogo/resumen',{
				cart,
				stock,
				pendientes : en_stock
			})
		}
		catch(err){
			console.error({
				message : 'Error en resumen de pedido',
				err
			})
		}
  	},
	actualizar : (req, res) => {
		// actualizar carrito desde resumen
		carrito.actualizarProducto(req)
		
		// Disable caching for content files
		res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

		return res.redirect('/catalogo/resume')
	},
  	pendientes: async (req, res) => {
		let cliente = req.session.user.numero;

		try {
			let cart = await carrito.traerCarrito(req);
			let result = await catalogo.traerPendientes(req);

			res.render('main/catalogo/pendientes',{
				pendientes : result[0].articulos,
				cart
    		})
		}
		catch(err){
			console.error(err)
		}
	},
  	relacionados : async (req, res) => {
		let art = req.query.relative

		try {
			let cart = await carrito.traerCarrito(req);
			let articulo = db.articulos.findOne({ 
				where: { codigo : art }, 
				attributes : ['oem'], 
				logging: false
			});
			let relacionados = await db.articulos.findAll({
    	        where : {
					[Op.and] : [
						{oem: {[Op.like]: '%'+ articulo.oem.trim() +'%' }},
						{codigo: {[Op.notLike]: art.trim() }}
					]
    	        }, 
				logging: false
    	    })
			res.render('main/catalogo/relacionados',{
		    	relacionados,
		    	cart
		    })
		}
		catch(err){
		  console.error(err)
		}
	},
  	finalizar: async (req, res) => {

		try {
    		let cart = await carrito.traerCarrito(req)
    		let stock = await carrito.validarStock(req);

			res.render('main/catalogo/finalizar',{
				cart,
				stock
			});
		}
		catch(err){
			console.error({
				message : 'error finalizando pedido',
				error : err
			})
		}
  	},
  	checkout: async (req, res) => {
		  
		let cliente = req.session.user.numero;
		let fecha = catalogo.fechaActual();
		let nota = req.body.nota;

		try {
			let articulos = await carrito.validarStock(req)
			let confirmados = [];
			let pendientes = [];

			for (let articulo of articulos.negativos) {
				pendientes.push({ 
					cliente : cliente,  
					articulo: articulo.codigo, 
					cantidad: articulo.cantidad 
				})
			}
			
			await db.pendientes.bulkCreate(pendientes, { logging: false })

  			let nuevo = await db.pedidos.create({
				cliente_id : cliente,
				estado : 0,
				fecha,
				nota
			},{ logging: false })

			let pedido = await db.pedidos.findOne({
				where : {
					cliente_id : nuevo.cliente_id,
					fecha : fecha
				}, 
				attributes : ['id'],
				logging: false
			})
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

			await db.pedido_articulo.bulkCreate(confirmados, { logging:false });

			let datos_cli = await db.clientes.findAll({
				where : { numero : cliente },
				attributes : ['razon_social','correo']
			})
			await mail.compra(datos_cli.razon_social, datos_cli.correo, cliente, fecha, nota, confirmados)
			// eliminar el carrito
			carrito.eliminarCarrito(req);
			return res.redirect('/clientes/pedidos');
		}
		catch(err){
			console.error({
				message : 'Error Checkout pedido',
				error : err
			})
		}
  	}
};

module.exports = controller;
