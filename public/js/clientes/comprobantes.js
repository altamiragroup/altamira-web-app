let divContenedor = document.querySelector('.tabla_comprobantes')
let cuenta = divContenedor.getAttribute('data-cliente');

fetch(`/api/comprobantes/cliente/${cuenta}`)
.then(response => response.json())
.then(result => {
    for (const comp of result) {
        let item = `
        <div id='dato'>
            <p>${comp.codfor}</p>
        </div>
        <div id='dato'>
            <a href="/clientes/comprobantes/${comp.codfor}/${comp.factura}">
                <p>${comp.factura}</p>
            </a>
        </div>
        <div id='dato'>
            <p>0000-00-00</p>
        </div>
        <div id='dato'>
            <p>${comp.monto}</p>
        </div>
        `
        divContenedor.innerHTML += item;
    }
})
