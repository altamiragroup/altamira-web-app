module.exports = (sequelize, dataTypes) => {
  let alias = "seguimientos";
  let cols = {
    cuenta: {
      type: dataTypes.INTEGER
    },
    preparacion: {
      type: dataTypes.STRING
    },
    fecha_preparacion: {
      type: dataTypes.STRING
    },
    formulario: {
      primaryKey: true,
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
    })
    Seguimiento.belongsTo(models.comprobantes, {
      as: "comprobante",
      foreignKey: "formulario"
    });
  };

  Seguimiento.prototype.formatDate = (date) => {
    
    if(date == null){
      return ''
    }

    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    return `${dd}/${mm}/${yyyy}`

  }

  return Seguimiento;
};
