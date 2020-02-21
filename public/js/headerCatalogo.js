window.onload = function(){
    let button = document.querySelector('#menuButton');
    let menu = document.querySelector('.container-fluid.menu');

    button.addEventListener('click', () => {

    menu.classList.toggle('hidden');
    })
}