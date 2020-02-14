module.exports = (sequelize, dataTypes) => {
  let alias = "comprobantes";
  let cols = {
    cliente_num: {
      type: dataTypes.INTEGER
    },
    tipo: {
      type: dataTypes.STRING,
      allowNull: false
    },
    numero: {
      primaryKey: true,
      type: dataTypes.INTEGER,
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
      Comprobante.belongsTo(models.clientes,{
        as: "cliente",
        foreignKey: "cliente_num"
      }),
      Comprobante.belongsTo(models.seguimientos, {
        as: "seguimiento",
        foreignKey: "numero"
      }),
      Comprobante.belongsToMany(models.articulos, {
        as: "articulos",
        through: "comp_articulo",
        foreignKey: "numero",
        otherKey: "articulo_id",
        timestamps: false
      })
  };

  return Comprobante;
};
