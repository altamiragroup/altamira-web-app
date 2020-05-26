let botones = document.querySelectorAll('.action');
let carritoIcon = document.querySelector('.carrito p');
let carrito = [];
// identificar productos ya agregados al carrito
axios.get('/api/carrito/articulos')
.then(result => {
    carrito = result.data
    for(boton of botones){
        let codigo = boton.getAttribute('data-codigo');
        for(articulo of carrito){
            if(codigo == articulo.codigo){
                boton.innerHTML = 'Eliminar';
                boton.classList.add('added')
                boton.classList.add('select')
            }
        }
    }
})
// agregar productos al carrito
for(boton of botones){
    boton.addEventListener('click', function(e){
        e.preventDefault()
        if(!this.classList.contains('select')){
            this.innerHTML = 'Eliminar';
            this.classList.add('added');
            axios.get('/api/carrito/agregar?api=true&agregar_articulo=' + this.getAttribute('data-codigo'))
            .then(response => console.log(response))

        } else if(this.classList.contains('added')){
            this.innerHTML = 'Comprar';
            axios.get('/api/carrito/eliminar?api=true&eliminar_articulo=' + this.getAttribute('data-codigo'))
            .then(response => console.log(response))
        }
        this.classList.toggle('select')
    })
}