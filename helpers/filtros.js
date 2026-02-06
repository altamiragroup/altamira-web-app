module.exports = {
  crear: req => {
    let filtros = {
      nuevos: 0,
      destacados: 0,
      espec: 0, // 👈 filtro especiales
      lineas: [],
      rubros: [],
      especialidades: [],
      busquedas: [],
    };

    req.session.filters = filtros;
  },

  borrar: req => {
    delete req.session.filters;
  },

  actualizar: req => {
    const busqueda = req.query.busqueda;
    const tipo = req.query.filter;
    const param = req.query.param;
    const filters = req.session.filters;

    if (tipo == 'linea') {
      let index = filters.lineas.indexOf(param);
      if (index == -1) filters.lineas.push(param);
      if (req.query.borrar && index != -1) filters.lineas.splice(index, 1);
    }

    if (tipo == 'rubro') {
      let index = filters.rubros.indexOf(param);
      if (index == -1) filters.rubros.push(param);
      if (req.query.borrar && index != -1) filters.rubros.splice(index, 1);
    }

    if (tipo == 'especialidades') {
      let index = filters.especialidades.indexOf(param);
      if (index == -1) filters.especialidades.push(param);
      if (req.query.borrar && index != -1) filters.especialidades.splice(index, 1);
    }

    if (busqueda || tipo == 'busqueda') {
      if (!req.query.borrar && busqueda) {
        let palabras = busqueda.replace(/ \w{2} /, ' ').split(' ');
        palabras.forEach(item => {
          let index = filters.busquedas.indexOf(item);
          if (index == -1) filters.busquedas.push(item);
        });
      } else {
        let index = filters.busquedas.indexOf(param);
        if (index != -1) filters.busquedas.splice(index, 1);
      }
    }

    if (tipo == 'nuevos') {
      filters.nuevos = req.query.borrar ? 0 : 1;
    }

    if (tipo == 'destacados') {
      filters.destacados = req.query.borrar ? 0 : 1;
    }

    if (tipo == 'espec') {
      filters.espec = req.query.borrar ? 0 : 1;
    }
  },

  traerArrayFiltros: req => {
    const filtros = req.session.filters;
    let items = [];

    class Filtro {
      constructor(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
      }
    }

    filtros.lineas.forEach(linea => {
      items.push(new Filtro('linea', linea));
    });

    filtros.rubros.forEach(rubro => {
      items.push(new Filtro('rubro', rubro));
    });

    filtros.especialidades.forEach(esp => {
      items.push(new Filtro('especialidades', esp));
    });

    filtros.busquedas.forEach(busqueda => {
      items.push(new Filtro('busqueda', busqueda));
    });

    if (filtros.nuevos == 1) {
      items.push(new Filtro('nuevos', 'si'));
    }

    if (filtros.destacados == 1) {
      items.push(new Filtro('destacados', 'si'));
    }

    if (filtros.espec == 1) {
      items.push(new Filtro('especiales', '1'));
    }

    return items;
  },
};