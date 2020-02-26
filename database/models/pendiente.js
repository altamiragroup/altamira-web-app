module.exports = (sequelize, dataTypes) => {
  let alias = "pendientes";
  let cols = {
    id: {
      primaryKey: true,
      type: dataTypes.INTEGER
    },
    cliente: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    articulo: {
      type: dataTypes.STRING,
      allowNull: false
    },
    cantidad: {
      type: dataTypes.INTEGER,
      allowNull: false
    }
  };
  const Pendiente = sequelize.define(alias, cols, { timestamps: false });

  Pendiente.associate = function(models) {

  };

  return Pendiente;
};
