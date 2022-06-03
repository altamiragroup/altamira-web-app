const precios = document.querySelectorAll('#condicion_pago');

if (precios.length) {
    precios.forEach(precio => {
        const condicion_pago = precio.getAttribute('data-condicion');
        let descuento = 0;
        let txt = 'dto + utilidad $';
        let valor = +precio.innerHTML;

        if (condicion_pago == "A") descuento = 0.57;
        if (condicion_pago == "B") descuento = 0.6;
        
        precio.innerHTML = txt + Math.round(valor * descuento) ;               
    })
}