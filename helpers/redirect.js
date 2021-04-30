module.exports = (req, res) => {
  let tipo = req.session.user.tipo;
  if (tipo == 'cliente') {
    return res.redirect('/clientes/perfil');
  }
  if (tipo == 'admin') {
    return res.redirect('/admin/panel');
  }
  if (tipo == 'viajante') {
    return res.redirect('/viajantes/perfil');
  }
};
