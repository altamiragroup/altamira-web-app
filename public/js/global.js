let boton = document.querySelector('.menu-toggle');
let menu = document.querySelector('.page-header .menu');

boton.addEventListener('click', function(){
  menu.classList.toggle('active')
})