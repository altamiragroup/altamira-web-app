let divContenedor = document.querySelector('.tabla_comprobantes')
let cuenta = divContenedor.getAttribute('data-cliente');
// Botones ------------------------------------
let buttons = document.querySelectorAll('button');
//let factura = document.querySelector('#factura');
//let credito = document.querySelector('#credito');
//let debito = document.querySelector('#debito');
//let todos = document.querySelector('#todos');

for (let button of buttons){
    button.addEventListener('click', function(){
        for(let button of buttons){
            button.classList.remove('active')
        }
        this.classList.toggle('active');

        if(this.innerHTML != 'todos'){
            traerComprobantes(cuenta, this.innerHTML)
        } else {
            traerComprobantes(cuenta)
        }
    })
}

traerComprobantes(cuenta);

// Event Listener
//todos.addEventListener('click', function(){
//    this.classList.toggle('active')
//    traerComprobantes(cuenta)
//})
//factura.addEventListener('click', function(){
//    this.classList.toggle('active')
//    traerComprobantes(cuenta,'factura')
//})
//credito.addEventListener('click', function(){
//    this.classList.toggle('active')
//    traerComprobantes(cuenta,'credito')
//})
//debito.addEventListener('click', function(){
//    this.classList.toggle('active')
//    traerComprobantes(cuenta,'debito')
//})

function traerComprobantes(cliente, tipo){

    let query = '/api/comprobantes/';

    if(tipo == undefined){
        query += `cliente/${cuenta}`;
    } 
    if(tipo != undefined){
        query += `tipo/${tipo}/${cliente}`;
    }
    fetch(query)
    .then(response => response.json())
    .then(result => {

        divContenedor.innerHTML = '';

        for (const comp of result) {
            let item = `
            <div id='dato'>
                <p>${comp.tipo}</p>
            </div>
            <div id='dato'>
                <a href="/clientes/comprobantes/${comp.numero}">
                    <p>${comp.numero}</p>
                </a>
            </div>
            <div id='dato'>
                <p>${comp.fecha}</p>
            </div>
            <div id='dato'>
                <p>${comp.valor}</p>
            </div>
            <div id='dato'>
                <a href="/clientes/comprobantes/${comp.numero}">
                    <img class="detalle-icon" src="/images/icons/catalogo/eye-regular.png" alt="">
                </a>
            </div>
            `
            divContenedor.innerHTML += item;
        }
        if(result.length == 0){
            divContenedor.innerHTML = `
            <div class="not-found">
                <h4>No se encontraron comprobantes</h4>
            </div>
            `;
        }
    })
    .catch( error => {
        console.log(error)
        divContenedor.innerHTML = `
        <div class="not-found">
            <h4>No se encontraron comprobantes</h4>
        </div>
        `;
        } );
}