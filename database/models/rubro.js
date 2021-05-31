module.exports = (sequelize, dataTypes) => {
  let alias = 'rubros';
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
  const Rubro = sequelize.define(alias, cols, { timestamps: false });

  Rubro.associate = function (models) {
    Rubro.hasMany(models.articulos, {
      as: 'articulos',
      foreignKey: 'id',
    }),
      Rubro.hasMany(models.sub_rubros, {
        as: 'sub_rubros',
        roeignKey: 'id',
      });
  };

  return Rubro;
};
