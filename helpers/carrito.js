const db = require('../database/models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Cart = require('../database/mongo/models/models').Cart;
const catalogo = require('./catalogo');

module.exports = {
    iniciarCarrito : (req) => {
        //let descuentoCli = catalogo.descuentoCliente(req);
        let cart = {
            cliente: req.session.user.numero,
            articulos : [],
            values : { 
                descuento : 25,
                total : 0 
            },
            actualizado : catalogo.fechaActual(),
        };
        // crear carrito en DB
        Cart.create( cart, (error) => console.log(error))
    },
    eliminarCarrito : (req) => {
        let cliente = req.session.user.numero;
        Cart.deleteOne({ cliente : cliente }, function(error){
            if(error) return console.log(error)
        })
    },
    crearFiltros : (req) => {
        let filters = {
            nuevos : 0,
            destacados : 0,
            lineas : [],
            rubros : [],
            busquedas : []
        }
        req.session.filters = filters
    },
    traerCarrito : (req) => {
        let cliente = req.session.user.numero;
        return Cart.findOne({ cliente: cliente })
    },
    agregarProducto : (req, res) => {
        let cliente = req.session.user.numero;
        let articulo = req.query.agregar_articulo;

        Cart.findOne({ cliente: cliente},(error, cart) => {
            if(error) return console.log(error);

            for (let art of cart.articulos) {
                if(art.codigo == articulo){
                    //return res.redirect('?update=add&item=' + articulo)
                }
            }
            db.articulos.findOne({
                where : { codigo : articulo },
                attributes: ['codigo','linea_id','descripcion','precio','unidad_min_vta','stock'],
                logging: false
            })
            .then(art => {
                let cantidad = req.query.cant != undefined ? req.query.cant : art.unidad_min_vta;
                let articulo = {
                    codigo : art.codigo,
                    linea : art.linea_id,
                    cantidad: cantidad,
                    min_vta: art.unidad_min_vta,
                    stock: art.stock,
                    precio : art.precio,
                    descripcion: art.descripcion   
                }
                cart.articulos.push(articulo);
                cart.save(function(error){
                    if(error) return console.log(error);
                })
            })
        })
    },
    eliminarProducto : async (req, res) => {
        let articulo = req.query.eliminar_articulo;
        let cliente = req.session.user.numero;
        let carrito = await Cart.findOne({ cliente: cliente });
        let articulos = carrito.articulos;

        for(i = 0; i < articulos.length ; i++){
            if(articulos[i].codigo == articulo){
                carrito.articulos.splice(i,1)
            }
        }
        carrito.save()
        if(!req.query.api){
            return res.redirect('/catalogo/resume')
        }
    },
    actualizarProducto : async (req, res) => {
        let cliente = req.session.user.numero;
        let action = req.query.update;
        let articulo = req.query.item;
        let carrito = await Cart.findOne({ cliente: cliente });
        
        if(action == 'add'){
            for (let art of carrito.articulos) {
                if(art.codigo == articulo){
                    art.cantidad += parseInt(art.min_vta);
                }
            }
        }
        if(action == 'reduce'){
            for (let art of carrito.articulos) {
                if(art.codigo == articulo){
                    if(art.cantidad <= art.min_vta){
                        return res.redirect('?eliminar_articulo=' + articulo)
                    }
                    if(art.cantidad > art.min_vta){
                        art.cantidad -= parseInt(art.min_vta);
                    }
                }
            }
        }
        carrito.markModified('articulos');
        carrito.save()
    },
    validarStock : (req) => {
        let cliente = req.session.user.numero;
        let stock = {
            positivos : [],
            negativos : [],
            criticos : [],
        }

        Cart.findOne({ cliente: cliente }, function(error, carrito){
            if(error) return console.log(error)
            
            for(articulo of carrito.articulos){
                if(articulo.stock > articulo.min_vta * 2){
                    stock.positivos.push(articulo)
                }
                if(articulo.stock < articulo.min_vta){
                    stock.negativos.push(articulo)
                }
                if(articulo.stock >= articulo.min_vta && articulo.stock <= articulo.min_vta * 2){
                    stock.criticos.push(articulo)
                }
            }
        });
        
        return stock;
    },
    totalCount : (cart) => {

        let precioTotal = 0;

        for(let art of cart.articulos){
        	if(art.stock >= art.min_vta){
    			precioTotal += (art.precio * art.cantidad)
        	}
        }
        return precioTotal / 100
    },
    calcIva : (total) => {
        return (total * 0.21) / 100
    }
}