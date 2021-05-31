'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('seguimientos', {
      cuenta: {
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      preparacion: {
        type: Sequelize.STRING,
      },
      fecha_preparacion: {
        type: Sequelize.STRING,
      },
      formulario: {
        type: Sequelize.STRING,
      },
      fecha_formulario: {
        type: Sequelize.STRING,
      },
      estado: {
        type: Sequelize.INTEGER,
      },
      salida: {
        type: Sequelize.STRING,
      },
      transporte: {
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('seguimientos');
  },
};
