let avatares = document.querySelectorAll('.carrousel .item');
let img = document.querySelector('.foto img');

function cambiarImagen(avatar) {

    let bg = window.getComputedStyle(avatar).backgroundImage;

    let url = bg.replace(/^url\(["']?/, '')
                .replace(/["']?\)$/, '');

    img.setAttribute('src', url);

    avatares.forEach(item => item.classList.remove('select'));

    avatar.classList.add('select');
}

avatares.forEach(avatar => {
    avatar.addEventListener('click', function () {
        cambiarImagen(this);
    });
});