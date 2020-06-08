let input_comp = document.querySelector('#busqueda_comp');
let button_comp = document.querySelector('#submit_comp');
let tipo = document.querySelector('#tipo_comp').value;
let container = document.querySelector('#result_data_comp');

function formatDate(date){
        let fecha = new Date(date)

        let yyyy = fecha.getFullYear();
        let mm = fecha.getMonth() + 1;
        let dd = fecha.getDate();
        
        let hh = fecha.getHours();
        let mmm = fecha.getMinutes();
        let sss = fecha.getSeconds();

        let fechaNew = `${dd}/${mm}/${yyyy} ${hh}:${mmm}:${sss}`
        return fechaNew
    }

function fetchDataComp(){
    let comprobante = input_comp.value;
    container.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
    axios.get(`/api/v2/comprobantes/${comprobante}?tipo=${tipo}&fulldata=true`)
    .then( response => {
        console.log(response)
        let comp = response.data.comprobante[0];
        let cli = comp.cliente;
        let articulos = response.data.articulos;

        container.innerHTML = `
            <div class="info wrap">
                <p>cliente:</p>
                <p>${cli.razon_social.substring(0,15)}</p>
                <p>Tipo:</p>
                <p>${comp.tipo}</p>
                <p>CAE:</p>
                <p>${comp.cae}</p>
                <p>Monto:</p>
                <p>$ ${new Intl.NumberFormat(["de-DE"]).format(comp.valor)}</p>
                <p>Transporte:</p>
                <p>${comp.transporte}</p>
                <p>Fecha:</p>
                <p>${formatDate(comp.fecha)}</p>
            </div>
        `;
        container.innerHTML += `
            <ul class="wrap">
                <li>Código</li>
                <li>Cantidad</li>
                <li>Precio</li>
            </ul>
        `
        articulos.forEach(art => {
            container.innerHTML += `
                <ul class="wrap">
                    <li>${art.articulo_id}</li>
                    <li>${art.cantidad}</li>
                    <li>${art.precio}</li>
                </ul>
            `
        })
    })


}

input_comp.addEventListener('keypress',(e) => {
    if(e.which == 13){
        e.preventDefault()
        fetchDataComp()
    }
})
button_comp.addEventListener('click', (e) => {
    e.preventDefault()
    fetchDataComp()
})