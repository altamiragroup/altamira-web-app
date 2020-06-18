let avatares = document.querySelectorAll('.carrousel .item');
let img = document.querySelector('.foto img');

function cambiarImagen(avatar){
    let bg = avatar.style.background;
    let url = bg.split('"')[1];
    img.setAttribute('src',url);
    avatares.forEach(item => item.classList.remove('select'));
    avatar.classList.add('select');
}

avatares[0].addEventListener('click',function(){
    cambiarImagen(this)
})
avatares[1].addEventListener('click',function(){
    cambiarImagen(this)
})
avatares[2].addEventListener('click',function(){
    cambiarImagen(this)
})