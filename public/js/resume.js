window.onload = function(){
    if(document.querySelector('div.alert')){

        let button = document.querySelector('#closeAlert');
        let divAlert = document.querySelector('div.alert');

        button.addEventListener('click', function(){
            divAlert.style.display = 'none';
        })
    }
}