const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

module.exports = {
  contacto: (req, res) => {
    let { nombre, empresa, localidad, telefono, correo, mensaje } = req.body;

    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });

    let compiled = ejs.compile(
      fs.readFileSync(path.join(__dirname, '../views/email/contacto.ejs'), 'utf8')
    );
    let html = compiled({ nombre, empresa, localidad, telefono, correo, mensaje });

    transporter.sendMail(
      {
        from: 'infoaltamiragroupsa@gmail.com',
        replyTo: 'disenoaltamira@gmail.com',
        to: 'info@altamiragroup.com.ar',
        bcc: 'publicidad@altamiragroup.com.ar',
        subject: 'Contacto vía web',
        html: html,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }

        res.redirect('/');
      }
    );
  },
  cliente: (req, res) => {
    let { nombre, empresa, cuit, localidad, direccion, telefono, mensaje } = req.body;
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });

    let compiled = ejs.compile(
      fs.readFileSync(path.join(__dirname, '../views/email/solicitud_viajante.ejs'), 'utf8')
    );
    let html = compiled({ nombre, empresa, cuit, localidad, direccion, telefono, mensaje });

    transporter.sendMail(
      {
        from: 'infoaltamiragroupsa@gmail.com',
        replyTo: 'disenoaltamira@gmail.com',
        to: 'info@altamiragroup.com.ar',
        subject: 'Solicitud de visita',
        html: html,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }

        res.redirect('/cliente');
      }
    );
  },
  pagos: (req, res) => {
    if (req.body.lenght == 0) {
      return res.send('sin datos en el formulario');
    }
    let { factura, monto, banco, fecha, mensaje } = req.body;
    let archivo = req.file ? req.file : { buffer: '', encoding: '' };

    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });
    transporter.sendMail(
      {
        from: '"Altamira Group" info@altamiragroup.com.ar',
        replyTo: 'info@altamiragroup.com.ar',
        to: 'info@altamiragroup.com.ar',
        subject: 'Aviso de pago',
        attachments: [
          {
            filename: archivo.originalname,
            content: new Buffer(archivo.buffer, archivo.encoding),
          },
        ],
        html: `
			<h1> Aviso de pago </h1>
			<p>Cliente: ${req.session.user.numero}</p> \n
			<p>Factura: ${factura}</p> \n
			<p>Monto: ${monto}</p> \n
			<p>Banco: ${banco}</p> \n
			<p>Fecha: ${fecha}</p> \n
			<p>Mensaje: ${mensaje}</p> \n
			`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }
        /* console.log(info.envelope);
			console.log(info.messageId); */
        res.redirect('/clientes/perfil');
      }
    );
  },
  registro: (usuario, clave, correo) => {
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });

    let compiled = ejs.compile(
      fs.readFileSync(path.join(__dirname, '../views/email/registro.ejs'), 'utf8')
    );
    let html = compiled({ usuario, clave });

    transporter.sendMail(
      {
        from: 'info@altamiragroup.com.ar',
        replyTo: 'info@altamiragroup.com.ar',
        to: 'info@altamiragroup.com.ar',
        /*bcc: 'publicidad@altamiragroup.com.ar',*/
        subject: '¡Bienvenido! - Altamira Group',
        html: html,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }

        return { info: info.envelope, message: info.messageId };
      }
    );
  },
  compra: (cliente, correo, cuenta, fecha, nota, articulos) => {
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });

    let compiled = ejs.compile(
      fs.readFileSync(path.join(__dirname, '../views/email/confirmacion_compra.ejs'), 'utf8')
    );
    let html = compiled({ cliente, cuenta, fecha, nota, articulos });

    transporter.sendMail(
      {
        from: '"Altamira Group" info@altamiragroup.com.ar',
        replyTo: 'info@altamiragroup.com.ar',
        to: correo,
        bcc: 'publicidad@altamiragroup.com.ar',
        subject: '¡Recibimos tu pedido! - Altamira Group',
        html: html,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }

        return { info: info.envelope, message: info.messageId };
      }
    );
  },
  deuda: (cliente, correo, numero, fecha, monto) => {
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });

    let compiled = ejs.compile(
      fs.readFileSync(path.join(__dirname, '../views/email/deuda.ejs'), 'utf8')
    );
    let html = compiled({ cliente, numero, fecha, monto });

    transporter.sendMail(
      {
        from: '"Altamira Group" info@altamiragroup.com.ar',
        replyTo: 'info@altamiragroup.com.ar',
        to: correo,
        bcc: 'publicidad@altamiragroup.com.ar',
        subject: 'Resumen de cuenta - Altamira Group',
        html: html,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }

        return { info: info.envelope, message: info.messageId };
      }
    );
  },
  listaPrecios: (cliente, correo) => {
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });

    let compiled = ejs.compile(
      fs.readFileSync(path.join(__dirname, '../views/email/precios.ejs'), 'utf8')
    );
    let html = compiled({ cliente });

    transporter.sendMail(
      {
        from: '"Altamira Group" info@altamiragroup.com.ar',
        replyTo: 'info@altamiragroup.com.ar',
        to: 'infoaltamiragroupsa@gmail.com',
        bcc: 'publicidad@altamiragroup.com.ar',
        subject: 'Lista de precios - Altamira Group',
        html: html,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }

        return { info: info.envelope, message: info.messageId };
      }
    );
  },
};
