module.exports = (sequelize, dataTypes) => {
  let alias = 'lineas';
  let cols = {
    id: {
      primaryKey: true,
      type: dataTypes.INTEGER,
    },
    nombre: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  };
  const Linea = sequelize.define(alias, cols, { timestamps: false });

  Linea.associate = function (models) {
    Linea.hasMany(models.articulos, {
      as: 'articulos',
      foreignKey: 'linea_id',
    });
  };

  return Linea;
};
