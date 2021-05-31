module.exports = {
  crear: req => {
    let filtros = {
      nuevos: 0,
      destacados: 0,
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
      if (index == -1) {
        filters.lineas.push(param);
      }
      if (req.query.borrar) {
        filters.lineas.splice(index, 1);
      }
    }
    if (tipo == 'rubro') {
      let index = filters.rubros.indexOf(param);
      if (index == -1) {
        filters.rubros.push(param);
      }
      if (req.query.borrar) {
        filters.rubros.splice(index, 1);
      }
    }
    if (tipo == 'especialidades') {
      let index = filters.especialidades.indexOf(param);
      if (index == -1) {
        filters.especialidades.push(param);
      }
      if (req.query.borrar) {
        filters.especialidades.splice(index, 1);
      }
    }
    if (busqueda || tipo == 'busqueda') {
      if (!req.query.borrar) {
        let palabras = busqueda.replace(/ \w{2} /, ' ').split(' ');

        palabras.forEach(item => {
          let index = filters.busquedas.indexOf(item);
          if (index == -1) {
            filters.busquedas.push(item);
          }
        });
      } else {
        let index = filters.busquedas.indexOf(param);
        filters.busquedas.splice(index, 1);
      }
    }
    if (tipo == 'nuevos') {
      if (filters.nuevos == 0) {
        filters.nuevos = 1;
      }
      if (req.query.borrar) {
        filters.nuevos = 0;
      }
    }
    if (tipo == 'destacados') {
      if (filters.destacados == 0) {
        filters.destacados = 1;
      }
      if (req.query.borrar) {
        filters.destacados = 0;
      }
    }
  },
  traerArrayFiltros: req => {
    filtros = req.session.filters;
    let items = [];

    class Filtro {
      constructor(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
      }
    }

    for (linea of filtros.lineas) {
      let filtro = new Filtro('linea', linea);
      items.push(filtro);
    }
    for (rubro of filtros.rubros) {
      let filtro = new Filtro('rubro', rubro);
      items.push(filtro);
    }
    for (esp of filtros.especialidades) {
      let filtro = new Filtro('especialidades', esp);
      items.push(filtro);
    }
    for (busqueda of filtros.busquedas) {
      let filtro = new Filtro('busqueda', busqueda);
      items.push(filtro);
    }
    if (filtros.nuevos == 1) {
      let filtro = new Filtro('nuevos', 'si');
      items.push(filtro);
    }
    if (filtros.destacados == 1) {
      let filtro = new Filtro('destacados', 'si');
      items.push(filtro);
    }

    return items;
  },
};
