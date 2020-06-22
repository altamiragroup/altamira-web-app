    let selectDescuento = document.querySelector('#selectDescuento');
    let labelDescuento = document.querySelector('#labelDescuento');
    let valueDescuento = document.querySelector('#valueDescuento');
    let clienteDescuento = parseInt(document.querySelector('#clienteDescuento').innerHTML);
    let valueClienteDesc = document.querySelector('#valueClienteDesc');

    let precioNeto = parseInt(document.querySelector('#precioNeto').innerHTML);
    let ivaValue = document.querySelector('#iva');
    let precioFinal = document.querySelector('#precioFinal');
    // iva
    ivaValue.innerHTML = (precioNeto * 0.21).toFixed(2);
    // descuento cliente
    valueClienteDesc.innerHTML = '- $' + (precioNeto * (clienteDescuento / 100)).toFixed(2);
    // descuento pago
    labelDescuento.innerHTML = 'Descuento: 20% + 5%';
    valueDescuento.innerHTML =  '- $' + ((precioNeto * 1.21) * 0.43).toFixed(2);
    // precio final
    precioFinal.innerHTML = '$' + ((precioNeto * 1.21) * (1 - (clienteDescuento / 100)) * 0.74).toFixed(2)


    selectDescuento.addEventListener('change', function(){
        if(this.value == 7){
            labelDescuento.innerHTML = 'Descuento: 20% + 5%';
            valueDescuento.innerHTML = '- $' + ((precioNeto * 1.21) * 0.26).toFixed(2);

            precioFinal.innerHTML = ((precioNeto * 1.21) * (1 - (clienteDescuento / 100)) * 0.74).toFixed(2)
        }
        if(this.value == 30){
            labelDescuento.innerHTML = 'Descuento: 20%';
            valueDescuento.innerHTML = '- $' + ((precioNeto * 1.21) * 0.20).toFixed(2)

            precioFinal.innerHTML = ((precioNeto * 1.21) * (1 - (clienteDescuento / 100)) * 0.80).toFixed(2)
        }
        if(this.value == 45){
            labelDescuento.innerHTML = 'Descuento: 10%';
            valueDescuento.innerHTML = '- $' + ((precioNeto * 1.21) * 0.10).toFixed(2)

            precioFinal.innerHTML = ((precioNeto * 1.21) * (1 - (clienteDescuento / 100)) * 0.90).toFixed(2)
        }
        if(this.value == 60){
            labelDescuento.innerHTML = 'Descuento: 0%';
            valueDescuento.innerHTML = '0'

            precioFinal.innerHTML = ((precioNeto * 1.21) * (1 - (clienteDescuento / 100))).toFixed(2)
        }
    })

let checkOut = document.querySelector('#checkOut');

if(precioNeto == '' || precioNeto == 0 || precioNeto == 'undefined'){
    checkOut.addEventListener('click', function(e){
        e.preventDefault();
        alert('Tu compra no posee artículos')
    })
}
