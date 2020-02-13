'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("clientes", {
      numero: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      razon_social: {
        type: Sequelize.STRING,
        allowNull: false
      },
      situacion_iva: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cuit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      viajante_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      condicion_pago: {
        type: Sequelize.STRING,
        allowNull: false
      },
      precio_especial: {
        type: Sequelize.STRING
      },
      transporte_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('clientes');
  }
};