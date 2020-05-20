module.exports = {
    manejarFiltros : (req) => {
        // busqueda viene por post
        const busqueda = req.query.busqueda;
        // datos de filtro
        const tipo = req.query.filter;
        const param = req.query.param;
        // filtros de la sesion
        const filters = req.session.filters;
        // ingresar filtros a la sesion
        if (tipo == "linea") {
            let index = filters.lineas.indexOf(
              param
            );
            if (index == -1) {
              filters.lineas.push(param);
            }
            if (req.query.borrar) {
              filters.lineas.splice(index, 1);
            }
        }
        if (tipo == "rubro") {
            let index = filters.rubros.indexOf(
              param
            );
            if (index == -1) {
              filters.rubros.push(param);
            }
            if (req.query.borrar) {
              filters.rubros.splice(index, 1);
            }
        }
        if (busqueda || tipo == "busqueda") {
            let index = filters.busquedas.indexOf(
              param
            );
            if (index == -1) {
              filters.busquedas.push(busqueda);
            }
            if (req.query.borrar) {
              filters.busquedas.splice(index, 1);
            }
        }
        if (tipo == "nuevos") {
            if (filters.nuevos == 0) {
              filters.nuevos = 1;
            }
            if (req.query.borrar) {
              filters.nuevos = 0;
            }
        }
        if (tipo == "destacados") {
            if (filters.destacados == 0) {
              filters.destacados = 1;
            }
            if (req.query.borrar) {
              filters.destacados = 0;
            }
        }
    },
    traerFiltros : (req, res) => {
        // traer los filtros para mostrar en la barra de busqueda
        filtros = req.session.filters;
        let items = []
        class Filtro{
            constructor(tipo, valor){
                this.tipo = tipo;
                this.valor = valor;
            }
        }
        for(linea of filtros.lineas){
            let filtro = new Filtro('linea', linea)
            items.push(filtro)
        }
        for(rubro of filtros.rubros){
            let filtro = new Filtro('rubro', rubro)
            items.push(filtro)
        }
        for(busqueda of filtros.busquedas){
            let filtro = new Filtro('busqueda', busqueda)
                items.push(filtro)
        }
        if(filtros.nuevos == 1){
            let filtro = new Filtro('nuevos', 'si')
            items.push(filtro)
        }
        if(filtros.destacados == 1){
            let filtro = new Filtro('destacados', 'si')
            items.push(filtro)
        }
        return items
    }
}