let input = document.querySelector('#busqueda')
let button = document.querySelector('#submit')
let div = document.querySelector('#result_data')

button.addEventListener('click', (e) => {
    e.preventDefault()
    let busqueda = input.value
    axios.get(`/api/articulos/${busqueda.replace('/','-')}`)
    .then(result => {
        console.log(result)
        if(result.data.response == null){
             div.innerHTML = 'Sin resultados'
        } else {
            let item = result.data.response;
            div.innerHTML = `
            <div class="avatar">
                <img src="/images/articulos/${item.linea_id}/${item.codigo.replace('/','-')}.jpg" alt="">
            </div>
            <div class="info wrap">
                <p>Código:</p>
                <p>${item.codigo}</p>
                <p>Precio:</p>
                <p>$ ${item.precio / 100}</p>
                <p>Unidad de venta:</p>
                <p>${item.unidad_min_vta}</p>
                <p>OEM:</p>
                <p>${item.oem}</p>
                <p>Modelos:</p>
                <p>${item.modelos}</p>
                <P>Descripción:</P>
                <p>${item.descripcion}</p>
            </div>
            `; 
        }
    })
})