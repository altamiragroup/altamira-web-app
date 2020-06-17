let deudaTotal = document.querySelectorAll('.item .cabecera span');
let montoFact = document.querySelectorAll('.montoFact');

function format(saldo){
    /* var num = saldo.replace(/\./g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        return num;
    } */
    return new Intl.NumberFormat(["de-DE"]).format(saldo)
}

for(let deuda of deudaTotal){
    let monto = deuda.innerHTML.split(' ')[1];
    let color = monto < 0 ? 'color:green' : 'color:red';
    deuda.setAttribute('style',color)
    if (monto.replace("-", "").length > 3) {
      deuda.innerHTML = "$" + format(monto);
    }
    
}

for(let value of montoFact){
    let monto = value.innerHTML.split(' ')[1];

    if (monto.replace("-", "").length > 3) {
      value.innerHTML = "$" + format(monto);
    }
}

/*--------------------------- */

let buttonCC = document.querySelector('#CC')
let buttonPE = document.querySelector('#PE')

if(location.search.includes('pe')){
  buttonPE.classList.add('active')
} else {
  buttonCC.classList.add('active')
}