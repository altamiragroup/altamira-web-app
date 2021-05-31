module.exports = (sequelize, dataTypes) => {
  let alias = 'pendientes';
  let cols = {
    id: {
      autoIncrement: true,
      type: dataTypes.INTEGER,
    },
    cliente: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    articulo: {
      primaryKey: true,
      type: dataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };
  const Pendiente = sequelize.define(alias, cols, { timestamps: false });

  Pendiente.associate = function (models) {
    Pendiente.hasMany(models.articulos, {
      as: 'articulos',
      foreignKey: 'codigo',
      otherKey: 'articulo',
    });
  };

  return Pendiente;
};
