let buttons = document.querySelectorAll('#detallePedidoWeb');
let body = document.querySelector('body');

function imprimirFecha(fecha){
    let date = new Date(fecha);
    
    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    return `${yyyy}-${mm}-${dd}`;
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        let pedidoId = button.getAttribute('data-id');
        axios.get('/api/v2/pedidos/'+ pedidoId +'?articulos=true')
        .then(res => {
            let data = res.data.pedido[0];
            let divModal = document.createElement('div');
            let divPedido = document.createElement('div');
            divModal.classList.add('modal');
            divPedido.classList.add('pedido-detalle');
            divPedido.innerHTML = `
                    <button id="cerrar">
                        cerrar
                    </button>
                    <h3>N° Pedido: ${data.id} </h3>
                    <p>Fecha: ${imprimirFecha(data.fecha)}</p>
                    <p>Nota: ${data.nota}</p>
                    <ul>
                        <li>Artículo</li>
                        <li>Descripción</li>
                        <li>Cant</li>
                        <li>Precio</li>
                    </ul>
            `;
            data.articulos.forEach(item => {
                divPedido.innerHTML += `
                    <ul>
                        <li>${item.codigo}</li>
                        <li>${item.descripcion.substring(0,20)}</li>
                        <li>${item.pedido_articulo.cantidad}</li>
                        <li>$ ${item.pedido_articulo.precio / 100}</li>
                    </ul>
                `;
            });
            divModal.insertAdjacentElement('beforeend',divPedido);
            body.insertAdjacentElement('afterbegin', divModal);

            let cerrar = document.querySelector('#cerrar');
            cerrar.addEventListener('click',() => {
                body.removeChild(divModal)
            })
        })
    })
});