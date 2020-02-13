module.exports = (sequelize, dataTypes) => {
  let alias = "comprobantes";
  let cols = {
    cliente_num: {
      primaryKey: true,
      type: dataTypes.INTEGER
    },
    tipo: {
      type: dataTypes.STRING,
      allowNull: false
    },
    numero: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: dataTypes.STRING,
      allowNull: false
    },
    valor: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    cae: {
      type: dataTypes.STRING,
      allowNull: false
    }
  };
  const Comprobante = sequelize.define(alias, cols, { timestamps: false });

  Comprobante.associate = function(models) {
    Comprobante.belongsTo(models.clientes, {
      as: "cliente",
      foreignKey: "cliente_num"
    }),
      /* Comprobante.belongsTo(models.tansportes, {
          as: "transporte",
          foreignKey: "transporte_id"
        }), */
      Comprobante.belongsToMany(models.articulos, {
        as: "articulo",
        through: "comp_articulo",
        foreignKey: "numero",
        otherKey: "articulo_id",
        timestamps: false
      });
  };

  return Comprobante;
};
