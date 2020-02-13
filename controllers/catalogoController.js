const db = require("../database/models");

const controller = {

  inicio: (req, res, next) => {
      db.articulos.findAll()
        .then (articulos => {
          db.lineas.findAll()
            .then(lineas => {
              db.rubros.findAll()
                .then(rubros => {
                /* db.sub_rubros.findAll()
                    .then(subrubros => { */
                      res.render("main/catalogo", {
                      articulos: articulos,
                      lineas: lineas,
                      rubros: rubros
                      //sub_rubros : subrubros
                  });
              //})
            });
          });
        })
  },
  linea: (req, res, next) => {

  },
  rubro: (req, res, next) => {
    
  },
  detalle: (req, res, next) => {
   
  },
  destacados: (req, res, next) => {
    
  },
  nuevos: (req, res, next) => {
   
  },
};

module.exports = controller;
