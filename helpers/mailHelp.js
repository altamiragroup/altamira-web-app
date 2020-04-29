const nodemailer = require('nodemailer');

module.exports = {
	contacto : (req,res) => {
		let { nombre, empresa, localidad, telefono, mensaje } = req.body;

		let transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});
		transporter.sendMail({
			from: '"Altamira Group" info@webapp.altamiragroup.com.ar',
			replyTo: 'info@altamiragroup.com.ar',
			to: 'info@altamiragroup.com.ar',
			subject: 'Contacto vía web',
			html: `
			<h1> Contacto </h1>
			<p>Nombre: ${nombre}</p> \n
			<p>Empresa: ${empresa}</p> \n
			<p>Localidad: ${localidad}</p> \n
			<p>Telefono: ${telefono}</p> \n
			<p>Mensaje: ${mensaje}</p> \n
			`
		}, (err, info) => {
			if(err){
				console.log(err)
			}
			console.log(info.envelope);
			console.log(info.messageId);
			res.redirect('/')
		});
	},
	cliente : (req,res) => {
		let { nombre, empresa, cuit, localidad, direccion, telefono, mensaje } = req.body;
		let transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});
		transporter.sendMail({
			from: '"Altamira Group" info@webapp.altamiragroup.com.ar',
			replyTo: 'info@altamiragroup.com.ar',
			to: 'info@altamiragroup.com.ar',
			subject: 'Solicitud de visita',
			html: `
			<h1> Solicitud de visita de viajante </h1>
			<p>Nombre: ${nombre}</p> \n
			<p>Empresa: ${empresa}</p> \n
			<p>Cuit: ${cuit}</p> \n
			<p>Localidad: ${localidad}</p> \n
			<p>Direccion: ${direccion}</p> \n
			<p>Telefono: ${telefono}</p> \n
			<p>Mensaje: ${mensaje}</p> \n
			`
		}, (err, info) => {
			if(err){
				console.log(err)
			}
			console.log(info.envelope);
			console.log(info.messageId);
			res.redirect('/cliente')
		});
	},
	pagos : (req,res) => {
		if(req.body.lenght == 0){
			return res.send('sin datos en el formulario')
		}
		console.log(req.file)

		let { factura, monto, banco, fecha, mensaje } = req.body;
		let archivo = req.file ? req.file : { buffer : '', encoding : ''};
		
		let transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});
		transporter.sendMail({
			from: '"Altamira Group" info@webapp.altamiragroup.com.ar',
			replyTo: 'info@altamiragroup.com.ar',
			to: 'ottoabarriosp@hotmail.com',
			subject: 'Aviso de pago',
			attachments : [{ 
				filename : archivo.originalname ,
				content : new Buffer(archivo.buffer, archivo.encoding)

			}],
			html: `
			<h1> Aviso de pago </h1>
			<p>Cliente: ${ req.session.user.numero }</p> \n
			<p>Factura: ${factura}</p> \n
			<p>Monto: ${monto}</p> \n
			<p>Banco: ${banco}</p> \n
			<p>Fecha: ${fecha}</p> \n
			<p>Mensaje: ${mensaje}</p> \n
			`
		}, (err, info) => {
			if(err){
				console.log(err)
			}
			console.log(info.envelope);
			console.log(info.messageId);
			res.redirect('/clientes/perfil')
		});
	}
}