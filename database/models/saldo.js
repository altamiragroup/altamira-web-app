module.exports = (sequelize, dataTypes) => {
  let alias = 'saldos';
  let cols = {
    cuenta: {
      primaryKey: true,
      type: dataTypes.INTEGER,
    },
    saldo: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };
  const Saldo = sequelize.define(alias, cols, { timestamps: false });

  Saldo.associate = function (models) {
    Saldo.belongsTo(models.clientes, {
      as: 'cliente',
      foreignKey: 'cuenta',
    });
  };
  return Saldo;
};
