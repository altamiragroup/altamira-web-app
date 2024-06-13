let botones = document.querySelectorAll('.action');
let prevPosition = null;
let carrito = [];

if(!prevPosition) window.scrollY = prevPosition;

// Event Handler Cantidad articulos

function cantidadArticulosHandler(){
    let cantForms = document.querySelectorAll('.cantForm');
    cantForms.forEach(form => {
        form[1].addEventListener('click',(e) => {
            e.preventDefault()
            let art = form.getAttribute('data-codigo');
            let cant = form[0].value;

            // Validar la cantidad
            if (cant <= 0) {
                alert('La cantidad debe ser mayor a 0, en el carrito figurará el modulo de vta.');
                form[0].value = 1; // Opcional: restablecer el valor a 1
                return; // Salir de la función si la cantidad no es válida
            }

            form[1].innerHTML = '<img src="/images/icons/preload.gif" alt="">'
            axios.get(`/api/v2/carritos/actualizar?update=agregar&item=${art}&cant=${cant}`)
            .then(response => {
                if(response.request.status == 200){
                    setTimeout(() => {
                        form[1].innerHTML = '<img src="/images/icons/catalogo/check-solid.png" alt="">'
                    }, 1000);
                }
            })
        })
    })
}

// Llama a la función cuando el documento esté listo
document.addEventListener('DOMContentLoaded', (event) => {
    cantidadArticulosHandler();
});
// identificar productos ya agregados al carrito
axios.get('/api/v2/carritos/articulos')
.then(result => {
    carrito = result.data
    for(boton of botones){
        let codigo = boton.getAttribute('data-codigo');
        for(articulo of carrito){
            if(codigo == articulo.codigo){
                boton.innerHTML = 'Eliminar';
                boton.setAttribute('href','?eliminar_articulo=' + codigo)
                boton.classList.add('added')
                boton.classList.add('select')
                let cantidadDiv = boton.nextElementSibling;
                cantidadDiv.classList.add('active');
                cantidadDiv.innerHTML = `
                    <form class="cantForm wrap" data-codigo="${codigo}">
                        <label for="cantidad">Cantidad</label>
                        <input type="number" name="cantidad" value="${articulo.cantidad}" id="">
                        <button><img src="/images/icons/catalogo/check-solid.png" alt=""></button>
                    </form>
                `
                cantidadArticulosHandler()
            }
        }
    }
})

// agregar productos al carrito
botones.forEach(boton => {
    boton.addEventListener('click', function(e){
        e.preventDefault()
        if(!this.classList.contains('select')){
            let codigoArt = this.getAttribute('data-codigo');
            this.innerHTML = 'Eliminar';
            this.classList.add('added');
            axios.get('/api/v2/carritos/agregar?agregar_articulo=' + codigoArt)
            .then(response => {
                if(response.request.status == 200){
                    prevPosition = window.scrollY;
                    window.location.reload()
                }
            })

        } else if(this.classList.contains('added')){
            let codigoArt = this.getAttribute('data-codigo');
            this.setAttribute('href','?agregar_articulo=' + codigoArt)
            this.classList.remove('added');
            this.innerHTML = 'Comprar';
            axios.get('/api/v2/carritos/eliminar?eliminar_articulo=' + codigoArt)
            .then(response => {
                if(response.request.status == 200){
                   let cantidadDiv = boton.nextElementSibling;
                   cantidadDiv.classList.remove('active');
                   cantidadDiv.innerHTML = ''
                }
            })
        }
        this.classList.toggle('select')
    })
})