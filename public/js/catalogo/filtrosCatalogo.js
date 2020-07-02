let div = document.querySelector('.item.filtros')

axios.get('/api/v2/carritos/filtros')
.then(res => {
    let data = res.data;
    for(filtro of data){
        div.innerHTML += `
        <div class="filtro">
            <a href="/catalogo/filtro?filter=${filtro.tipo}&param=${filtro.valor}&borrar=true">x</a>
            <h3>${filtro.tipo}: ${filtro.valor}</h3>
        </div>`
    }
})