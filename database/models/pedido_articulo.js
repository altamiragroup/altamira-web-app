module.exports = (sequelize, dataTypes) => {
  let alias = 'pedido_articulo';
  let cols = {
    pedido_id: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    articulo_id: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };
  const Pedido_articulo = sequelize.define(alias, cols, {
    timestamps: false,
    tableName: 'pedido_articulo',
  });

  Pedido_articulo.associate = function (models) {
    Pedido_articulo.hasMany(models.pedidos, {
      as: 'pedido',
      foreignKey: 'id',
    }),
      Pedido_articulo.hasMany(models.articulos, {
        as: 'articulo',
        foreignKey: 'id',
      });
  };

  return Pedido_articulo;
};
