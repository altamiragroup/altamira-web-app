module.exports = (sequelize, dataTypes) => {
  let alias = 'especialidades';
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
  const Especialidad = sequelize.define(alias, cols, { timestamps: false });

  Especialidad.associate = function (models) {
    Especialidad.hasMany(models.articulos, {
      as: 'articulos',
      foreignKey: 'id',
    }),
      Especialidad.hasMany(models.sub_rubros, {
        as: 'sub_rubros',
        roeignKey: 'id',
      });
  };

  return Especialidad;
};
