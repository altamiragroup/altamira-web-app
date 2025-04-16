let logoMenu = document.querySelector('.logo-menu');
let items = document.querySelectorAll('.item');
let menu = document.querySelector('.menu-header');

let ops = document.querySelector('#drop-down');
let opsMenu = document.querySelector('#drop-down ul');

logoMenu.addEventListener('click', () => {
    items.forEach(item => {
        item.classList.toggle('active');
    });
    menu.classList.toggle('active');
})

ops.addEventListener('click', () => {
    opsMenu.classList.toggle('active');
    menu.classList.toggle('visible');
})

