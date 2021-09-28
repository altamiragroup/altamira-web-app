// paso 1 - capturar boton con el ID ej: #actualizar_stock
// paso 2 - crear escuchador de evento click
// paso 2.5 - DEJAR PREVENT DEFAULT
// paso 3 - crear funcion que le pega a la api 
// paso 4 - agregar archivo actualizar_stock.js en la vista
// paso 5 - crear boton con id actualizar_stock
let buttonact = document.querySelector('#actualizar_stock')

buttonact.addEventListener('click', (e) => {
    e.preventDefault()
    axios.get(`/api/v2/articulos/actualizar_stock`)
    .then(respuesta => {
        console.log(respuesta);
    }).catch(console.error)
})