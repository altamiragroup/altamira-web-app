//window.addEventListener('load', function(){
    if(document.querySelector('div.alert')){

        let divAlert = document.querySelector('div.alert');
        let button = document.querySelector('#closeAlert');

        button.addEventListener('click', function(){
        	divAlert.style.display = 'none';
        })
    }

    let button = document.querySelector('#finalizarPedido');
    let totalArticulos = document.querySelector('#totalArticulos').innerHTML;

    if(totalArticulos == 0){
        button.addEventListener('click', function(e){
            e.preventDefault();
            alert('No tenés artículos en el carro de compras')
        })
    }
//}