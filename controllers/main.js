const db = require('../database/models');
const redirect = require('../helpers/redirect');
const mailHelp = require('../helpers/mailHelp');
const lista_precios = require('../helpers/pdf/lista_precios');

function getTitle(req) {
  let tipo = req.session.user.tipo;
  let spacio = '_'

  if (tipo == 'cliente') {
    return 'Panel de cliente' + spacio;
  }
  if (tipo == 'admin') {
    return 'Panel de administración' + spacio;
  }
  if (tipo == 'viajante') {
    return 'Panel de Viajante' + spacio;
  }
  if (tipo == 'invitado') {
    return 'Iniciar sesion' + spacio;
  }
}

const controller = {
  inicio: (req, res) => {
    let title_login = getTitle(req);
    res.render('main/index', { title_login: title_login });
  },
  login: (req, res) => {
    let error = '';
    if (req.query.error == 'invalidUser') {
      error = 'Debes ingresar a tu cuenta';
    }
    res.render('main/login', { error });
  },
  validarLogin: async (req, res) => {
    try {
      console.log('🟢 Intentando login para usuario:', req.body.usuario);

      const user = await db.usuarios.findOne({
        where: { usuario: req.body.usuario },
        logging: false,
      });

      if (!user) {
        console.log('🔴 Usuario no encontrado en BD');
        return res.render('main/login', { error: 'El usuario no existe' });
      }
      
      // 🚫 Si superó los 3 logins
      console.log('🟡 Usuario encontrado:', user.usuario, '| tipo:', user.tipo);
      if (user.logins >= 3) {
        console.log('🚫 Usuario superó la cantidad de sesiones permitidas');
        return res.render('main/login', { error: 'Agotó cantidad de sesiones' });
      }
      if (user.clave == req.body.clave) {
        console.log('🟢 Clave correcta');

        // 🧮 Actualizar cantidad de logins
        const nuevosLogins = (user.logins || 0) + 1;
        const resultado = await db.usuarios.update(
          { logins: nuevosLogins },
          { where: { id: user.id, tipo: 'prueba' }, logging: false }
        );

        console.log(`🧩 Logins actualizados para ${user.usuario}: ${nuevosLogins}`);
        console.log('Resultado UPDATE:', resultado);

        // 🔍 Buscar datos del cliente (solo si aplica)
        const cliente = await db.clientes.findOne({
          where: { numero: user.numero },
          logging: false,
        });

        const usuarioFinal = {
          id: user.id,
          usuario: user.usuario,
          tipo: user.tipo,
          numero: user.numero,
          condicion_pago: (cliente && cliente.condicion_pago) ? cliente.condicion_pago : null,
        };

        console.log('✅ usuarioFinal:', usuarioFinal);

        // Guardar sesión
        req.session.user = usuarioFinal;
        res.locals.user = usuarioFinal;
        res.cookie('user', usuarioFinal, { maxAge: 1000 * 60 * 60 * 24 * 7 });

        return redirect(req, res);
      } else {
        console.log('🔴 Clave incorrecta');
        return res.render('main/login', { error: 'Usuario o clave invalido' });
      }
    } catch (err) {
      console.error('❌ Error en validarLogin:', err);
      return res.render('main/login', { error: 'Ocurrió un error al iniciar sesion' });
    }
  },
  recuperar: async (req, res) => {
    if (req.body.cuit) {
      let cuit = req.body.cuit.replace(/-/g, '').trim();
      try {
        let cliente = await db.clientes.findOne({
          where: { cuit },
          attributes: ['numero', 'correo'],
          logging: false,
        });
        let usuario = await db.usuarios.findOne({
          where: { numero: cliente.numero, tipo: 'cliente' },
          attributes: ['usuario', 'clave'],
          logging: false,
        });
        await mailHelp.registro(usuario.usuario, usuario.clave, cliente.correo);
        return res.render('main/recuperar', {
          mensaje: 'Usuario y clave enviados a su correo: ' + cliente.correo,
        });
      } catch (err) {
        console.log({
          message: 'Error al recuperar clave',
          err,
        });
      }
    } else {
      res.render('main/recuperar', { mensaje: '' });
    }
  },
  nosotros: (req, res) => {
    let title_login = getTitle(req);
    res.render('main/nosotros', { title_login });
  },
  resetLogins: async (req, res) => {
    try {
      const [resultado] = await db.usuarios.update(
        { logins: 0 },
        { where: { tipo: 'prueba' }, logging: false }
      );

      console.log(`🔄 Logins reseteados para ${resultado} usuarios tipo 'prueba'`);
      res.redirect('/admin?reset=ok'); // o donde quieras redirigir después
    } catch (err) {
      console.error('❌ Error al resetear logins:', err);
      res.redirect('/admin?reset=error');
    }
  },
  precios: (req, res) => {
    let title_login = getTitle(req);
    res.render('main/precios', { title_login });
  },
  precios_pdf: (req, res) => {
    // generar PDF lista
    lista_precios(res);
  },

  destacados: (req, res) => {
    let user = req.session.user;
    let title_login = getTitle(req);

    if (user.tipo == 'cliente') {
      return res.render('main/destacados', { title_login });
    }
    res.render('main/destacados', { title_login });
  },
  cliente: (req, res) => {
    let title_login = getTitle(req);
    res.render('main/cliente', { title_login });
  },
  contacto: (req, res) => {
    let title_login = getTitle(req);
    res.render('main/contacto', { title_login });
  },
  logout: (req, res) => {
    req.session.destroy();
    res.locals.user = {};
    delete res.locals;
    delete res.session;
    res.cookie('user', null, { maxAge: -1 });
    return res.redirect('/');
  },
  formulario: (req, res) => {
    let type = req.query.type;

    if (req.body.email) {
      return res.redirect('/');
      /* este input es trampa para los bots y esta oculto, si viene con
      texto es porque el formulario lo envio un bot
      */
    } else {
      return res.send('enviado');
      //mailHelp.contacto(req,res)
    }

    if (type == 'cliente') {
      mailHelp.cliente(req, res);
    }
  },
};

module.exports = controller;
