const url = require('url');

module.exports = {
    orderFilters : (req) => {
        let filtros = (url.parse(req.url).path).split('/');
        filtros.splice(0,1);

        console.log('----- ORDENAR -----');

        console.log(filtros);
        
        console.log('----- ORDENAR -----');
        


    },
    destroyFilter : (req) => {
        // traemos el filtro que queremos borrar
        let filtroParaBorrar = req.query.delete;
        // separamos los filtros en un array 
        // la posicion 0 es un espacio vacio, la ultima posicion es el querystring
        let filtros = (url.parse(req.url).path).split('/')
        // eliminamos el espacio vacio en la posicion 0
        let filtrosFinal = filtros.splice(0,1);
        // eliminamos el querystring de la ultima posicion
        // (el metodo splice modifica el array ORIGINAL (filtros), 
        //  lo que guardas en la variable nueva es el elemento que sacaste)
        filtrosFinal = filtros.splice(-1,1)
        // guardamos la posicion del filtro que vamos a eliminar
        let filtroAct = filtros.indexOf(filtroParaBorrar);
        // eliminamos el filtro del array junto con el valor: filtro/valor
        let arrSinFiltro = filtros.splice(filtroAct,2);
        // volvemos a unir los filtros con una /
        let urlFinal = filtros.join('/');
        // retornamos la nueva url
        return urlFinal
    },
    fetchFilters : (req) => {
        let ruta = url.parse(req.url).path;
        let arrayFiltros = ruta.split('/');
        let filtros = [];
        for (const filtro of arrayFiltros) {
            if(filtro === 'linea' || filtro === 'rubro' || filtro === 'subrubro'){
                filtros.push(filtro)
            }
        }
        return filtros;
    }
}