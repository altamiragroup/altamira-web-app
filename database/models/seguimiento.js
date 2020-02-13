module.exports = (sequelize, dataTypes) => {
  let alias = "seguimientos";
  let cols = {
    cuenta: {
      primaryKey: true,
      type: dataTypes.INTEGER
    },
    preparacion: {
      type: dataTypes.STRING
    },
    fecha_preparacion: {
      type: dataTypes.STRING
    },
    formulario: {
      type: dataTypes.STRING
    },
    fecha_formulario: {
      type: dataTypes.STRING
    },
    estado: {
      type: dataTypes.INTEGER
    },
    salida: {
      type: dataTypes.STRING
    },
    transporte: {
      type: dataTypes.STRING
    }
  };
  const Seguimiento = sequelize.define(alias, cols, { timestamps: false });

  Seguimiento.associate = function(models) {
    Seguimiento.belongsTo(models.clientes, {
      as: "cliente",
      foreignKey: "cuenta"
    });
  };

  return Seguimiento;
};
