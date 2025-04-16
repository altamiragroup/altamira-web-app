let input = document.querySelector('#busqueda')
let button = document.querySelector('#submit')
let div = document.querySelector('#result_data')
/*let movimiento = document.querySelector('#movimiento')
let uses = document.querySelector('#uses')
*/
let costo1 = document.querySelector('#costo1')

function fetchData(){
    let busqueda = input.value;
        div.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
        movimiento.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
        uses.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
        costo1.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';

        axios.get(`/api/v2/articulos?buscar=${busqueda}&limit=1`)
        .then((result) => {
        if (result.data[0] == null) {
            div.innerHTML = "Sin resultados";
        } else {
            let item = result.data[0];
            div.innerHTML = `
                <div class="avatar">
                    <img src="/images/articulos/${
                      item.linea_id
                    }/${item.codigo.replace("/", "-")}.jpg" alt="">
                </div>
                <div class="info wrap" display="flex" flex-wrap="wrap";>                
                    <p>Código:</p>
                    <p>${item.codigo}</p>
                    <p>Precio:</p>
                    <p>$ ${item.precio / 100}</p>
                    <p>Unidad vta:</p>
                    <p>${item.unidad_min_vta}</p>
                    <p style="color:red"><b>Stock:</b></p>
                    <p style="color:red"><b>${item.stock}</b></p>
                    <p>Proveedor:</p>
                    <p>${item.proveedor}</p>
                    <p>OEM:</p>
                    <p>${item.oem}</p>
                    <p>Descripción:</p>
                    <p>${item.descripcion}</p>
                    <p>Modelos:</p>
                    <p>${item.modelos}</p>
                    <p>Costo:</p>
                    <p>${item.costo1}</p>                    
                </div>`;
            if(item.estado == 0) div.innerHTML += '<p style="color:red">Dado de baja</p>'                                                   
            
        }
    });
}

input.addEventListener('keypress',(e) => {
    if(e.which == 13){
        e.preventDefault()
        fetchData()
    }
})
button.addEventListener('click', (e) => {
    e.preventDefault()
    fetchData()
})