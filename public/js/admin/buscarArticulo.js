let input = document.querySelector('#busqueda')
let button = document.querySelector('#submit')
let div = document.querySelector('#result_data')
let movimiento = document.querySelector('#movimiento')
let uses = document.querySelector('#uses')
let componentes = document.querySelector('#componentes')

function fetchData(){
    let busqueda = input.value;
        div.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
        movimiento.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
        uses.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
        componentes.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';

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
                <div class="info wrap">
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
                    <p>Modelos:</p>
                    <p>${item.modelos}</p>
                    <P>Descripción:</P>
                    <p>${item.descripcion}</p>
                </div>
            `;
            if(item.estado == 0) div.innerHTML += '<p style="color:red">Dado de baja</p>'

            axios.get(`/api/v2/articulos/${item.codigo.replace("/", "-")}?comp=true&uses=true`)
            .then( result => {
                let mov = result.data.articulo.comprobantes;
                movimiento.innerHTML = '<h3>Movimiento de artículo</h3>'
                if(mov){
                    mov.forEach( mov => {
                        movimiento.innerHTML += `
                            <ul class="wrap">
                                <li>Cliente: ${mov.cliente_num}</li>
                                <li>${mov.tipo.substring(0,7)}</li>
                                <li>${mov.numero}</li>
                                <li><img src="/images/icons/catalogo/eye-regular.png" alt=""></li>
                            </ul>
                        `; 
                    })
                }
                
                let usesArr = result.data.usesArr;
                uses.innerHTML = '<h3>Artículos con mismo OEM</h3>'

                if(usesArr){
                    usesArr.forEach(use => {
                        uses.innerHTML += `
                            <ul class="wrap">
                                <li>${use.codigo}</li>
                                <li>${use.descripcion}</li>
                            </ul>
                        `;
                    })
                }

                axios.get(`/api/v2/articulos/${item.codigo.replace("/", "-")}/componentes`)
                .then(result => {
                    let cant = result.data.armes;
                    if(cant != -1){
                        componentes.innerHTML = `
                            <h3>Componentes</h3>
                            <p>Disponible para armar: ${cant}</p>
                        `
                    } else {
                        componentes.innerHTML = 'Sin resultados'
                    }
                })
            })
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