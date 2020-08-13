const db = require('../database/models');
const Sequelize = require("sequelize");
const Cart = require('../database/mongo/models/models').Cart;

module.exports = {
    nuevo : async (cliente) => {
        try {
            let cli = await db.clientes.findOne({
                where: { numero: cliente },
                logging: false
            })
            let cart = {
                cliente,
                articulos : [],
                values : {  
                    descuento : cli.obtenerDescuentoCliente(), 
                    total : 0  
                }
            };
            await Cart.create(cart)
        }
        catch(error){
            console.error({
                message: 'error iniciando carrito',
                error
            })
        }
    },
    eliminar : async (cliente) => {
        try {
            await Cart.deleteOne({ cliente }, (err) => {
                if(err) throw err
            })
        }
        catch(error){
            console.error({
                message: 'error eliminando carrito',
                error
            })
        }
    },
    traer : async (cliente) => {
        try {
            return Cart.findOne({ cliente },(err, cart) => {
                if(err) throw err
                return cart
            })
        }
        catch(error){
            console.error({
                message: 'error obteniendo carrito',
                error
            })
        }
    },
    agregarArticulo : async (cliente, articulo, cantidad) => {
        
        try {
            Cart.findOne({ cliente }, async (err, cart) => {
                if(err) throw err

                for (let art of cart.articulos){
                    if(art.codigo == articulo) throw 'El artículo ya existe'
                }

                let art = await db.articulos.findOne({
                    where : { codigo : articulo },
                    attributes : ['codigo','linea_id','descripcion','precio','unidad_min_vta','stock'],
                    logging: false
                })

                let cantidad_articulo = cantidad ? cantidad : art.unidad_min_vta;

                let articulo_nuevo = {
                    codigo : art.codigo,
                    linea : art.linea_id,
                    cantidad: cantidad_articulo,
                    min_vta: art.unidad_min_vta,
                    stock: art.stock,
                    precio : art.precio,
                    descripcion: art.descripcion   
                }

                cart.articulos.push(articulo_nuevo);
                cart.save()
            })
        }
        catch(error){
            console.error({
                message: 'error agregando articulo',
                error
            })
        }
    },
    eliminarArticulo : async (cliente, articulo) => {
        try {
            Cart.findOne({ cliente },(err, carrito) => {
                if(err) throw err
                
                let articulos = carrito.articulos;

                for(i = 0; i < articulos.length ; i++){
                    if(articulos[i].codigo == articulo){
                        carrito.articulos.splice(i,1)
                    }
                }

                carrito.save()
            });
        }
        catch(error){
            console.error({
                message: 'error eliminando articulo',
                error
            })
        }
    },
    actualizarArticulo : async (cliente, articulo, accion, cantidad) => {
        try {
            Cart.findOne({ cliente },(err, carrito) => {
                if(err) throw err
                
                if(accion == 'agregar'){
                    for(let articulo_carrito of carrito.articulos){
                        if(articulo_carrito.codigo == articulo){
                            if(cantidad){
                                cantidad_nueva = parseInt(cantidad)
                                while (cantidad_nueva % articulo_carrito.min_vta != 0){
                                    cantidad_nueva ++
                                }
                                articulo_carrito.cantidad = cantidad_nueva
                            } else {
                                articulo_carrito.cantidad += parseInt(articulo_carrito.min_vta)
                            }
                        }
                    }
                }
                if(accion == 'reducir'){
                    for(let articulo_carrito of carrito.articulos){
                        if(articulo_carrito.codigo == articulo){
                            if(articulo_carrito.cantidad <= articulo_carrito.min_vta){
                                for(i = 0; i < carrito.articulos.length ; i++){
                                    if(carrito.articulos[i].codigo == articulo){
                                        carrito.articulos.splice(i,1)
                                    }
                                }
                            }
                            if(articulo_carrito.cantidad > articulo_carrito.min_vta){
                                articulo_carrito.cantidad -= parseInt(articulo_carrito.min_vta)
                            }
                        }
                    }
                }
                
                carrito.markModified('articulos');
                carrito.save()
            });
        }
        catch(error){
            console.error({
                message: 'error actualizando articulo',
                error
            })
        }
    },
    traerArticulosPorStock : async (cliente) => {

        try {
            let articulos = {
                positivos : [],
                negativos : [],
                criticos : []
            }
            await Cart.findOne({ cliente },(err, carrito) => {
                if(err) throw err
                
                for(articulo of carrito.articulos){
                    if(articulo.stock > articulo.min_vta * 2){
                        articulos.positivos.push(articulo)
                    }
                    if(articulo.stock < articulo.min_vta){
                        articulos.negativos.push(articulo)
                    }
                    if(articulo.stock >= articulo.min_vta && articulo.stock <= articulo.min_vta * 2){
                        articulos.criticos.push(articulo)
                    }
                }
            });
            return articulos;
        }
        catch(error){
            console.error({
                message : 'error al traer articulos',
                error
            })
        }
    },
    montoTotalArticulos : async (cliente) => {

        try {
            Cart.findOne({ cliente },(err, carrito) => {
                if(err) throw err
                
                let montoTotal = 0;

                for(let art of carrito.articulos){
                	if(art.stock >= art.min_vta){
    	        		montoTotal += (art.precio * art.cantidad)
                	}
                }

                return {
                    total : montoTotal,
                    iva : (montoTotal * 0.21) / 100
                }
            });
        }
        catch(error){
            console.error({
                message : 'error al calcular monto total',
                error
            })
        }
    }   
}