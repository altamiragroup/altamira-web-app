//window.addEventListener('load', function(){
    if(document.querySelector('div.alert')){

        let divAlert = document.querySelector('div.alert');
        let button = document.querySelector('#closeAlert');

        button.addEventListener('click', function(){
        	divAlert.style.display = 'none';
        })
    }
//}