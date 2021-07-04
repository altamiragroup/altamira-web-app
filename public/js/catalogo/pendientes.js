window.addEventListener('load', () => {
  (async function () {
    const response = await axios.get('/api/v2/pendientes/session/stock');
    const pendientes = response.data;

    if (pendientes.length) {
      const div = document.querySelector('.pendientes-aviso');
      const aviso = document.createElement('div');
      aviso.innerHTML = `
        <p>Su cuenta posee artículos pendientes <b>con stock</b>, ¿desea agregarlos a su pedido?</p>
        <button class="agregar-pendientes" style="background-color: #46fd46">agregar al carrito</button>
        <button class="descartar-pendientes">eliminar pendientes</button>
        `;
      div.appendChild(aviso);
      div.style.display = 'block';

      const add = document.querySelector('.agregar-pendientes');
      const remove = document.querySelector('.descartar-pendientes');

      async function eliminarPendientes(pendientes_) {
        await pendientes_.reduce(async (acc, curr) => {
          await acc;
          return await axios.delete('/api/v2/pendientes/cuenta/session');
        }, Promise.resolve());
      }

      add.addEventListener('click', async () => {
        try {
          await pendientes.reduce(async (acc, curr) => {
            await acc;
            return axios.get('/api/v2/carritos/agregar?agregar_articulo=' + curr.codigo);
          }, Promise.resolve());

          await eliminarPendientes(pendientes)

          location.reload();
        } catch (error) {
          console.error(error);
        }
      });

      remove.addEventListener('click', async () => {
        try {
          await eliminarPendientes(pendientes);
        } catch (error) {
          console.error(error);
        }
      });
    }
  })();
});
