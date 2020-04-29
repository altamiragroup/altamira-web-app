const db = require('../database/models');

module.exports = {
    createCart : (req, res) => {
/*         db.clientes.findOne({
            where : {
                numero : req.session.user.numero
            },
            attributes : ['condicion_pago']
        })
        .then( cliente => {
             */
            let cart = {
                articulos : [],
                values : {
                    descuento : 25,
                }
            };
/* 
            if(cliente.condicion_pago == 'A'){
                cart.values.descuento = 25;
            }
            if(cliente.condicion_pago == 'B'){
                cart.values.descuento = 20;
            }
            if(cliente.condicion_pago == 'C'){
                cart.values.descuento = 30;
            } */

            req.session.cart = cart;
        /* }) */
    },
    addProduct : (req, res) => {
        let cart = req.session.cart;
        let articulo = req.query.agregar_articulo;

        for (let art of cart.articulos) {
            if(art.codigo == articulo){
                return res.redirect('?update=add&item=' + art.codigo)
            }
        }

        db.articulos.findOne({
            where : {
                codigo : articulo
            },
            attributes: ['codigo','linea_id','descripcion','precio','unidad_min_vta','stock']
        })
        .then(result => {

            // si enviamos la cantidad por querystring usarla, sino agregar la unidad min de vta
            let cantidad = req.query.cant != undefined ? req.query.cant : result.unidad_min_vta;
            // TRAER STOCK Y PRECIO DESDE API
            let articulo = {
                codigo : result.codigo,
                linea : result.linea_id,
                cantidad: cantidad,
                min_vta: result.unidad_min_vta,
                precio : result.precio,
                stock: result.stock,
                descripcion: result.descripcion
            }

            req.session.cart.articulos.push(articulo);
        })
    },
    deleteProduct : (req, res) => {
        let cart = req.session.cart;
        let articulo = req.query.eliminar_articulo;

        let indice;
        for (let i = 0; i < cart.articulos.length; i++) {
            if(cart.articulos[i].codigo == articulo){
                indice = i;
            }
        }
        // eliminar articulo del array (si usas delete queda la posicion como undefined)
        cart.articulos.splice(indice, 1);
    },
    updateProduct : (req, res) => {
        let cart = req.session.cart;
        let action = req.query.update;
        let articulo = req.query.item;
        
        if(action == 'add'){
            for (let art of cart.articulos) {
                if(art.codigo == articulo){
                    art.cantidad += parseInt(art.min_vta);
                }
            }
            req.session.cart = cart;
        }
        if(action == 'reduce'){
            for (let art of cart.articulos) {
                if(art.codigo == articulo){
                    if(art.cantidad == art.min_vta){
                        return res.redirect('?eliminar_articulo=' + articulo)
                    }
                    if(art.cantidad > art.min_vta){
                        art.cantidad -= parseInt(art.min_vta);
                    }
                }
            }
            req.session.cart = cart;
        }
    },
    checkStock : (cart) => {
        let articulos = {
            enStock : [],
            consultar : [],
            sinStock : []
        }
        for (let art of cart.articulos) {

            if( art.stock > art.min_vta){
                articulos.enStock.push(art)
            } 
            if( art.stock == art.min_vta){
                articulos.consultar.push(art)
            }
            if( art.stock < art.min_vta){
                articulos.sinStock.push(art)
            }

        }
        return articulos
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
    },
    descuentoCliente : (req) => {

        db.clientes.findOne({
            where : { numero : req.session.user.numero },
            attributes : ['condicion_pago']
        })
      .then(cliente => {
          
        return cliente.condicion_pago;
      })
    }
}