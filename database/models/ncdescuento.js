module.exports = (sequelize, dataTypes) => {
  let alias = 'ncdescuento';
  let cols = {
    id: {
      autoIncrement: true,
      type: dataTypes.INTEGER,
    },
    cliente: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    numero: {
      primaryKey: true,
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    comprobante: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    monto: {
      type: dataTypes.DECIMAL,
      allowNull: false,
    },
    tipo: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    cae: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: dataTypes.DATE,
      allowNull: false,
    },
    perc_ARBA: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };
  const Ncdescuento = sequelize.define(alias, cols, {
    timestamps: false,
    tableName: 'ncdescuento',
  });

  return Ncdescuento;
};
