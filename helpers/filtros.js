module.exports = {
    traerFiltros : (req, res) => {
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