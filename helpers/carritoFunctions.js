const db = require('../database/models');

module.exports = {
    createCart : (req, res) => {

        let cart = {
            articulos : []
        };

        req.session.cart = cart;
    },
    addProduct : (req, res) => {
        let cart = req.session.cart;
        let articulo = req.query.agregar_articulo;

        for (let art of cart.articulos) {
            if(art.codigo == articulo){
                return res.redirect('?upload=add&item=' + art.codigo)
            }
        }

        db.articulos.findOne({
            where : {
                codigo : articulo
            },
            attributes: ['codigo','linea_id','descripcion','precio','unidad_min_vta','stock']
        })
        .then(result => {
            let sessionCart = req.session.cart

            let articulo = {
                codigo : result.codigo,
                linea : result.linea_id,
                cantidad: result.unidad_min_vta,
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
                console.log(cart.articulos[i].codigo);
                console.log('articulo: '+articulo+' en el indice'+i);
                indice = i;
            }
        }
        // eliminar articulo del array (si usas delete queda la posicion como undefined)
        cart.articulos.splice(indice, 1);
    },
    updateProduct : (req, res) => {
        let cart = req.session.cart;
        let action = req.query.upload;
        let articulo = req.query.item;
        
        if(action == 'add'){
            for (let art of cart.articulos) {
                if(art.codigo == articulo){
                    art.cantidad += art.min_vta;
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
                        art.cantidad -= art.min_vta;
                    }
                }
            }
            req.session.cart = cart;
        }
    },
    checkCart : (req, res) => {

    },
    checkStock : (cart) => {
        let articulosEnStock = cart.articulos.filter(art => {
            return parseInt(art.stock) >= 1;
        })

        return articulosEnStock.length;
    },
    totalCount : (cart) => {

        let precioTotal = 0;

        for(let art of cart.articulos){
          precioTotal += (art.precio * art.cantidad)
        }
        return precioTotal
    },
    calcIva : (total) => {
        return total * 0.21
    }

}