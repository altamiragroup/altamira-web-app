'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("rubros", {
    id: {
      primaryKey: true,
      type: dataTypes.INTEGER
    },
    rubro_id :{
      type : dataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: dataTypes.STRING,
      allowNull: false
    }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rubros');
  }
};