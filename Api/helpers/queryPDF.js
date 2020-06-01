const sql = require("mssql");
const db = require("../../database/models");
const Sequelize = require("sequelize")
const sequelize = db.sequelize;
const Op = Sequelize.Op;

module.exports = (req, res) => {
    const { tipo, cliente, numero } = req.query;

    let datosCliente = db.clientes.findOne({
        where : { numero : cliente},
        attributes : {
            exclude : ['telefono','correo','precio_especial','transporte']
        },
        logging: false
    })
    let comprobantes = db.comprobantes.findAll({ 
        where : { numero : numero }, 
        attributes : {
            exclude : ['cliente_num']
        },
        logging: false
    })
    let query = '';

    if(tipo === 'Factura'){
        query = `
        SELECT comp_articulo.articulo_id, comp_articulo.cantidad, comp_articulo.precio, comp_articulo.despacho, articulos.descripcion, articulos.modelos
        FROM comp_articulo
        JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
        WHERE numero = ${numero}
        `
    }

    if(tipo === 'Credito'){
        query = `
        SELECT comp_articulo.articulo_id, comp_articulo.cantidad, comp_articulo.precio, comp_articulo.descripcion
        FROM comp_articulo
        LEFT JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
        WHERE numero = ${numero}
        `
    }

    let articulos = sequelize.query(query)

    Promise.all([datosCliente,comprobantes,articulos])
	    .then(result => {
            // subtotal gravado
            let subtotalGravado = 0;
            for(articulo of result[2][0]){
                // setear precios con 2 decimales
                articulo.precio = parseFloat(articulo.precio).toFixed(2)
                // calcular subtotal
                subtotalGravado += articulo.precio * parseInt(articulo.cantidad)
            }
            // descuento
            let descuento = (25 * subtotalGravado / 100).toFixed(2);
            // subtotal
            let subtotal = parseFloat(subtotalGravado - descuento).toFixed(2);
            // iva INSC
            let iva = Math.round((subtotal * 0.21) * 100) / 100;
            // enviar valores a la factura
            let valores = { 
                subtotalGravado : parseFloat(subtotalGravado).toFixed(2), 
                descuento, 
                subtotal, 
                iva 
            }
            result[0].situacion_iva == 'I' ? result[0].situacion_iva = 'Responsable Inscripto' : 'Monotributo';

	    	return res.json({
	    		status_code : res.statusCode,
	    		response : {
	    			cliente : result[0],
	    			comprobante : result[1],
                    valores,
	    			articulos : result[2]
	    		}
	    	})
	    }) .catch( error => console.log(error))
}