module.exports = (sequelize, dataTypes) => {
  let alias = "comp_articulo";
  let cols = {
    numero: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    articulo_id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    precio: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    despacho: {
      type: dataTypes.INTEGER,
      allowNull: false
    }
  };
  const Comp_articulo = sequelize.define(alias, cols, {
    timestamps: false,
    tableName: "comp_articulo"
  });

  Comp_articulo.associate = function(models) {
    Comp_articulo.hasMany(models.comprobantes, {
      as: "comprobante",
      foreignKey: "numero"
    }),
    Comp_articulo.hasMany(models.articulos, {
      as: "articulo",
      foreignKey: "id"
    });
  };

  return Comp_articulo;
};
