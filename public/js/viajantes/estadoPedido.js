let values = document.querySelectorAll('.estadoPedido');

for (estado of values){
    let value = estado.innerHTML
    if(value == 1){
        estado.innerHTML = 'Enviado';
    } else {
        estado.innerHTML = 'Pendiente';
    }
}