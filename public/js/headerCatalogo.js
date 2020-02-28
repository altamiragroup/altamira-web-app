window.onload = function(){
    let button = document.querySelector('#menuButton');
    let menu = document.querySelector('.container-fluid.menu');
    let articulos = document.querySelector('.articulos');

    button.addEventListener('click', () => {

        menu.classList.toggle('hidden');
    })
    // capturamos los clicks de todo el documento
    document.addEventListener('click', (e) => {
        // capturamos el objetivo del click
        let click = e.target;
        // comprobamos que se haga click fuera del boton o el menu
        if(menu.style.height != '0px' && click != button  && click != menu){

            menu.classList.add('hidden')
        }
    })


}