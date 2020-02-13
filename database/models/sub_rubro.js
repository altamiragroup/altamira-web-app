module.exports = (sequelize, dataTypes) => {
  let alias = "sub_rubros";
  let cols = {
    id: {
      primaryKey: true,
      type: dataTypes.INTEGER
    },
    rubro_id: {
      type: dataTypes.STRING,
      allowNull: false
    },
    nombre: {
      type: dataTypes.STRING,
      allowNull: false
    }
  };
  const Sub_rubro = sequelize.define(alias, cols, { timestamps: false });

  Sub_rubro.associate = function(models) {
      Sub_rubro.belongsTo(models.rubros, {
          as : 'rubro',
          foreignKey : 'rubro_id'
          }),
      Sub_rubro.hasMany(models.articulos, {
          as: "articulos",
          foreignKey: "id"
          })
  };

  return Sub_rubro;
};
