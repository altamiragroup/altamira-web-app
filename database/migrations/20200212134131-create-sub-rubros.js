'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sub_rubros', {
      id: {
        primaryKey: true,
        type: dataTypes.INTEGER,
      },
      rubro_id: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      nombre: {
        type: dataTypes.STRING,
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sub_rubros');
  },
};
