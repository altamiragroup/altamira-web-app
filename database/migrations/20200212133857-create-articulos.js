'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("articulos", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      oem: {
        type: Sequelize.STRING
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      modelos: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rubro_id: {
        type: Sequelize.INTEGER
      },
      sub_rubro_id: {
        type: Sequelize.INTEGER
      },
      renglon: {
        type: Sequelize.INTEGER
      },
      linea_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      caracteristicas: {
        type: Sequelize.STRING,
        allowNull: false
      },
      precio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unidad_min_vta: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      proveedor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      destacado: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.INTEGER
      },
      orden: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('articulos');
  }
};