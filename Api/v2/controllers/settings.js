exports.index = (req, res) => {
    res.render('clientes/settings', { title: 'Configuración' }); // Asegúrate de que existe una vista llamada "settings.ejs"
  };