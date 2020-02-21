window.onload = function(){
    let selectDescuento = document.querySelector('#selectDescuento');
    let labelDescuento = document.querySelector('#labelDescuento');
    let valueDescuento = document.querySelector('#valueDescuento');
    let clienteDescuento = document.querySelector('#clienteDescuento').innerHTML;
    let valueClienteDesc = document.querySelector('#valueClienteDesc');

    let precioNeto = document.querySelector('#precioNeto').innerHTML;
    let ivaValue = document.querySelector('#iva');
    let precioFinal = document.querySelector('#precioFinal');

    labelDescuento.innerHTML = 'Pago a 7 días 20% + 5%';
    valueDescuento.innerHTML = precioNeto * 0.43;
    ivaValue.innerHTML = (precioNeto * 0.21).toFixed(2);
    valueClienteDesc.innerHTML = (precioNeto * (clienteDescuento / 100)).toFixed(2);
    precioFinal.innerHTML = ((precioNeto * 1.21) - (precioNeto * 0.43)).toFixed(2)


    selectDescuento.addEventListener('change', function(){
        if(this.value == 7){
            labelDescuento.innerHTML = 'Pago a 7 días 20% + 5%';
            valueDescuento.innerHTML = '- $' + (precioNeto * 0.43).toFixed(2);

            precioFinal.innerHTML = ((precioNeto * 1.21) - (precioNeto * 0.43)).toFixed(2)
        }
        if(this.value == 30){
            labelDescuento.innerHTML = 'Pago a 30 días 20%';
            valueDescuento.innerHTML = '- $' + (precioNeto * 1.20).toFixed(2)

            precioFinal.innerHTML = ((precioNeto * 1.21) - (precioNeto * 0.20)).toFixed(2)
        }
        if(this.value == 45){
            labelDescuento.innerHTML = 'Pago a 45 días 10%';
            valueDescuento.innerHTML = '- $' + (precioNeto * 1.10).toFixed(2)

            precioFinal.innerHTML = ((precioNeto * 1.21) - (precioNeto * 0.10)).toFixed(2)
        }
        if(this.value == 60){
            labelDescuento.innerHTML = 'Pago a 60 días NETO';
            valueDescuento.innerHTML = '0'

            precioFinal.innerHTML = (precioNeto * 1.21).toFixed(2)
        }
    })
}