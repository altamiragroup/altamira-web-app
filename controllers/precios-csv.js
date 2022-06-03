const controller = {
    inicio: async (req, res) => {
      try {
        const rutaArchivo = `${__dirname}/../lista_altamira.csv`;
  
        return res.download(rutaArchivo)
      } catch (err) {
        console.error({
          message: 'Error en el catálogo',
          err,
        });
      }
    }
  };
  
  module.exports = controller;