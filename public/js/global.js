let boton = document.querySelector('.menu-toggle');
let menu = document.querySelector('.menu');

boton.addEventListener('click', function(){
  menu.classList.toggle('active');
  boton.classList.toggle('on');
});