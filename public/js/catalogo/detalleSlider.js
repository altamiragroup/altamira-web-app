let avatares = document.querySelectorAll('.slider label');
let img = document.querySelector('.imgProdDetalle img');

function cambiarImagen(avatar){
    let bg = avatar.style.background;
    let url = bg.split('"')[1]
    console.log(url)
    img.setAttribute('src',url)
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