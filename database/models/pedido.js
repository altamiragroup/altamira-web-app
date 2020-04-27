module.exports = (sequelize, dataTypes) => {
  let alias = "pedidos";
  let cols = {
    id: {
      primaryKey: true,
      type: dataTypes.INTEGER
    },
    cliente_id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: dataTypes.STRING,
      allowNull: false
    },
    fecha: {
      type: dataTypes.DATE
    },
    nota : {
      type: dataTypes.STRING
    }
  };
  const Pedido = sequelize.define(alias, cols, { timestamps: false });

  Pedido.associate = function(models) {
      Pedido.belongsTo(models.clientes, {
        as: "cliente",
        foreignKey: "cliente_id"
      }),
      Pedido.belongsToMany(models.articulos, {
          as: "articulos",
          through: "pedido_articulo",
          foreignKey: "pedido_id",
          otherKey: "articulo_id",
          timestamps: false
      });
  };

  return Pedido;
};
