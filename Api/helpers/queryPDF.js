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
    })
    let comprobantes = db.comprobantes.findAll({ 
        where : { numero : numero }, 
        attributes : {
            exclude : ['cliente_num']
        }
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
            
            result[0].situacion_iva == 'I' ? result[0].situacion_iva = 'Responsable Inscripto' : 'Monotributo';

	    	return res.json({
	    		status_code : res.statusCode,
	    		response : {
	    			cliente : result[0],
	    			comprobante : result[1],
	    			articulos : result[2]
	    		}
	    	})
	    }) .catch( error => console.log(error))
}