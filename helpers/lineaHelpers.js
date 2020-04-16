module.exports = (params, req) => {

	let numFilters = Object.keys(params).length;

	if (numFilters > 1){
		if(params.lineaId && params.rubroId && params.subId == undefined){
            console.log('--- linea y rubro ---');
            return 

        }
        if(params.lineaId && params.subId && params.rubroId == undefined){
            console.log('--- linea y sub rubro ---');  
        }
        if(params.lineaId && params.rubroId && params.subId){
            console.log('--- linea, rubro y sub rubro ---');  
        }
	} else {
        console.log('--- Sin filtros adicionales ---');
        return query.articulosLinea(req);
    }
}