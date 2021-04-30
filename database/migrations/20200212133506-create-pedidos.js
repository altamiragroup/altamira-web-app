'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pedidos', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      transporte_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fecha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      monto: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pedidos');
  },
};
