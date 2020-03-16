const db = require("../database/models");
const sequelize = db.sequelize;

const sql = require("mssql");
const config = {
            user: "sa",
            password: "B0mbard3o!",
            server: "190.57.226.9",
            database: "DotAltamira"
        };

module.exports = {
    general : (req, res) => {
		// enviar todos los comprobantes
		let cuenta = req.params.cliente;

        db.comprobantes.findAll({ where : { cliente_num : cuenta } })
		.then(result => {
                return res.send(result)
            })
	},
	numero : (req, res) => {
		// enviar informacion de un comprobante por numero
	},
	tipo : (req, res) => {
		// enviar todos los comprobantes del mismo tipo
		let {tipo,cliente} = req.params;
		let tabla = '';

		if(tipo == 'credito') tabla = 'dbo.ncXdto';
		if(tipo == 'debito') tabla = 'dbo.ncXdto';
		if(tipo == 'factura') tabla = 'dbo.ncXdto';
		
            sql.connect(config, function(err) {
              if (err) console.log(err);

              var request = new sql.Request();

              request.query("select top 10 nrocta,nrofor,factura,monto,codfor,nrocae from "+ tabla +" WHERE nrocta = 00" + cliente, function(err, result) {
                if (err) res.send(err);
                if(result.recordset != undefined){
                	return res.send(result.recordset);
                }
              });
            });
	},
	detalle : (req, res) => {
		let {cliente, numero} = req.params;
		let 
			datosCliente = db.clientes.findOne({
				where : { numero : cliente},
				attributes : {exclude : ['telefono','correo','precio_especial','transporte']},
			})
			comprobantes = db.comprobantes.findAll( { where : { numero : numero }, attributes : {exclude : ['cliente_num']} })
			articulos = sequelize.query(`
			SELECT comp_articulo.articulo_id, comp_articulo.cantidad, comp_articulo.precio, comp_articulo.despacho, articulos.descripcion, articulos.modelos
			FROM comp_articulo
			JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
			WHERE numero = ${numero}`)
		
			Promise.all([datosCliente,comprobantes,articulos])
			//.then(result => res.send(result[2]))
			.then(result => {
				return res.json({
					status_code : res.statusCode,
					response : {
						cliente : result[0],
						comprobante : result[1],
						articulos : result[2]
					}
				})
			}) .catch( error => res.send(error))
	}
}