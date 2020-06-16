let saldo = document.querySelector('.deuda h3 span');

if(saldo.innerHTML > 0){
    saldo.setAttribute('id','saldoNegativo')
} else {
    saldo.setAttribute('id','saldoPositivo')
}

function format(saldo){
    /* var num = saldo.replace(/\./g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        return num;
    } */

    return new Intl.NumberFormat(["de-DE"]).format(saldo)
}

saldo.innerHTML = `$ ${format(saldo.innerHTML)}`