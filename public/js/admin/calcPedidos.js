let spanPedidos = document.querySelector('.pedidos span')
let spanPorcent = document.querySelector('.porcent span')

let mes_actual = new Date().getMonth() + 1;

axios.get('/api/v2/pedidos')
.then(response => {
    let pedidos = response.data;
    let pedidos_nuevos = pedidos.filter( item => new Date(item.fecha).getMonth() + 1 === mes_actual )
    let pedidos_anteriores = pedidos.filter( item => new Date(item.fecha).getMonth() + 1 === mes_actual - 1 )

    spanPedidos.innerHTML = pedidos_nuevos.length;

    if(pedidos_nuevos.length  < pedidos_anteriores.length){
        spanPorcent.style.color = 'red';
    } else {
        spanPorcent.style.color = 'green';
    }
    spanPorcent.innerHTML = `
        ${Math.round((pedidos_nuevos.length / pedidos_anteriores.length * 100) -100) }%
    `


})