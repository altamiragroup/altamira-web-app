const db = require('../database/models');

module.exports = {
    createCart : (req, res) => {
        console.log('------- carrito functions -------');

        let cart = {
            articulos : []
        };

        req.session.cart = cart;
    },
    addProduct : (req, res) => {

        console.log('------- carrito functions -------');

        let art = req.query.agregar_articulo;

        db.articulos.findOne({
            where : {
                codigo : art
            },
            attributes: ['codigo', 'unidad_min_vta', 'precio']
        })
        .then(result => {
            let cart =  req.cookies.cart;
            let sessionCart = req.session.cart

            let articulo = {
                codigo : result.codigo,
                cantidad: result.unidad_min_vta,
                precio : result.precio
            }

            req.session.cart.articulos.push(articulo)
            
            return res.send(req.session.cart)
        })
    },
    deleteProduct : (req, res) => {

    },
    updateProduct : (req, res) => {

    },
    checkCart : (req, res) => {

    },
    checkStock : (req, res) => {

    },

}